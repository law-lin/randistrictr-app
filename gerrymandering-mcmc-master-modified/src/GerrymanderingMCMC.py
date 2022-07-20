from pathlib import Path
import json
import math
import random
import networkx as nx
from networkx.algorithms import tree, boundary
# import matplotlib.pyplot as plt
from functools import reduce
from networkx.readwrite import json_graph
import argparse

# Globals we care about
MAX_POP_DIFFERENCE_PERCENTAGE = .05


class GerrymanderingMCMC():
    """
        Use a Markov Chain Monte Carlo simulation to generate an ensemble of redistricting plans
        against a given potential plan, and use the alternatives to see how much of an outlier the proposed plan is.
    """

    def __init__(self, graph_file, cooling_period=50, rounds=50, verbose=False):
        # We initialize all_districts here, but we really establish it when we read our graph in
        self.all_districts = set()
        self.g = self.read_graph(graph_file)
        self.cooling_period = cooling_period
        self.verbose = verbose
        self.district_colors = {
            "01": "red",
            "02": "green",
            "03": "yellow",
            "04": "blue"
        }
        self.data = []
        self.original_data = {}
        # box and whisker plot data START
        # format will be a list of lists (each inner list is a list of sorted districts of populations)
        self.district_black_pops = []
        self.district_hispanic_pops = []
        self.district_american_indian_pops = []
        self.district_asian_pops = []
        self.district_hawaiian_pops = []
        self.district_other_pops = []
        self.district_vap_black_pops = []
        self.district_vap_hispanic_pops = []
        self.district_vap_american_indian_pops = []
        self.district_vap_asian_pops = []
        self.district_vap_hawaiian_pops = []
        self.district_vap_other_pops = []
        self.district_cvap_black_pops = []
        self.district_cvap_hispanic_pops = []
        self.district_cvap_american_indian_pops = []
        self.district_cvap_asian_pops = []
        self.district_cvap_hawaiian_pops = []
        self.district_cvap_other_pops = []
        self.district_democrat_pops = []
        self.district_republican_pops = []
        # box and whisker plot data END
        self.__record_key_stats(self.g, is_original_plan=True)

    def read_graph(self, path):
        """
            Given a path to an specialized JSON format describing a graph and it's metadata
            Returns a nx.Graph with relevant metadata stored on the node objects
        """
        g = nx.Graph()
        node_data = self.__load_json(path)
        for node_label in node_data:
            # Read in nodes from json format
            g.add_node(node_label)
            for adj_node in node_data[node_label]["adjacent_nodes"]:
                g.add_edge(node_label, adj_node)
            # Recom required fields
            g.nodes[node_label]["population"] = node_data[node_label]["population"]
            g.nodes[node_label]["voting_history"] = node_data[node_label]["voting_history"]
            g.nodes[node_label]["district"] = node_data[node_label]["district"]
            # Total Data
            g.nodes[node_label]["black_pop"] = node_data[node_label]["black_pop"]
            g.nodes[node_label]["hispanic_pop"] = node_data[node_label]["hispanic_pop"]
            g.nodes[node_label]["american_indian_pop"] = node_data[node_label]["american_indian_pop"]
            g.nodes[node_label]["asian_pop"] = node_data[node_label]["asian_pop"]
            g.nodes[node_label]["hawaiian_pop"] = node_data[node_label]["hawaiian_pop"]
            g.nodes[node_label]["other_pop"] = node_data[node_label]["other_pop"]
            # VAP Data
            g.nodes[node_label]["vap_population"] = node_data[node_label]["vap_population"]
            g.nodes[node_label]["vap_black"] = node_data[node_label]["vap_black"]
            g.nodes[node_label]["vap_hispanic"] = node_data[node_label]["vap_hispanic"]
            g.nodes[node_label]["vap_american_indian"] = node_data[node_label]["vap_american_indian"]
            g.nodes[node_label]["vap_asian"] = node_data[node_label]["vap_asian"]
            g.nodes[node_label]["vap_hawaiian"] = node_data[node_label]["vap_hawaiian"]
            g.nodes[node_label]["vap_other"] = node_data[node_label]["vap_other"]
            # CVAP Data
            g.nodes[node_label]["cvap_population"] = node_data[node_label]["cvap_population"]
            g.nodes[node_label]["cvap_black"] = node_data[node_label]["cvap_black"]
            g.nodes[node_label]["cvap_hispanic"] = node_data[node_label]["cvap_hispanic"]
            g.nodes[node_label]["cvap_american_indian"] = node_data[node_label]["cvap_american_indian"]
            g.nodes[node_label]["cvap_asian"] = node_data[node_label]["cvap_asian"]
            g.nodes[node_label]["cvap_hawaiian"] = node_data[node_label]["cvap_hawaiian"]
            g.nodes[node_label]["cvap_other"] = node_data[node_label]["cvap_other"]

            # Election Data
            g.nodes[node_label]["democrat_voting"] = node_data[node_label]["democrat_voting"]
            g.nodes[node_label]["republican_voting"] = node_data[node_label]["republican_voting"]
            # Summed Minority Population
            g.nodes[node_label]["minority_pop"] = node_data[node_label]["minority_pop"]

            self.all_districts.add(node_data[node_label]["district"])
        # fname = "output/original"
        # with open(fname, 'w') as file:
        #     file.write(json.dumps(json_graph.adjacency_data(g)))

        return g

    def __load_json(self, path):
        """
            Loads a json file at a particular file-path location (str)
            Returns a json object corresponding to the data at the specified path
        """
        with Path(path).open() as json_file:
            return json.load(json_file)

    def __get_node_colors(self, g):
        """
            Use self.district_colors_map to return a list of colors corresponding to each node in a graph
        """
        return [self.district_colors[g.nodes[n]["district"]] for n in g.nodes]

    def __efficiency_gap(self, graph):
        """
            Determines the efficiency gap for a given district, and for whom it is in favor
            NOTE: Currently assumes a two-party system because plurality voting is the status quo; I'll improve the code when we improve our voting system
        """
        d_votes_wasted = r_votes_wasted = 0.00

        # Initialize tally-counters for both parties in each district
        district_dict = {}
        for district_label in self.all_districts:
            district_dict[district_label] = {"D": 0, "R": 0}

        # Count the votes for each party in each district
        for precinct_label in graph.nodes:
            precinct = graph.nodes[precinct_label]
            precinct_district = precinct["district"]
            district_dict[precinct_district][precinct["voting_history"]] += 1

        # For each district, determine which party won and the wasted votes accordingly
        for district_label in self.all_districts:
            district = self.__get_district_subgraph(graph, district_label)
            # Total vote for a representative is just the number of precincts there are - the number of nodes on the graph
            total_district_votes = len(district.nodes)
            # Plurality voting would mean that we wouldn't even need this many votes if more than two systems were relevant players;
            #   but plurality voting also has a funny way of pushing elections towards two-party systems - so let's just assume that
            #   only two parties matter and therefore 50% of the precincts are needed
            votes_to_win = math.ceil(total_district_votes / 2.0)
            d_votes = district_dict[district_label]["D"]
            r_votes = district_dict[district_label]["R"]

            # And again - votes are wasted if they are cast for a losing party, or are a surplus beyond the amount required to win
            if d_votes > r_votes:
                d_votes_wasted += d_votes - votes_to_win
                r_votes_wasted += r_votes
            elif r_votes > d_votes:
                d_votes_wasted += d_votes
                r_votes_wasted += r_votes - votes_to_win
            else:
                None
                # NOTE: Pass when the district ends in a tie
        return (max([d_votes_wasted, r_votes_wasted]) - min([d_votes_wasted, r_votes_wasted])) / len(graph.nodes)

    def __random_district_label(self, graph):
        """
            UTIL method for getting a random district from a graph of nodes
        """
        return random.sample(graph, 1)[0]

    def __find_neighboring_district(self, g, district):
        """
            Given a graph and a district,
            Return a district_subgraph that neighbors it
        """
        node_boundary = boundary.node_boundary(g, district.nodes)
        districts_on_boundary = set([g.nodes[n]["district"] for n in node_boundary])
        random_district_label = self.__random_district_label(districts_on_boundary)
        return self.__get_district_subgraph(g, random_district_label)

    def __get_district_nodes(self, g, district_label):
        """
            Given a nx.graph and a district_label
            Return a list of all the precincts (nodes) in that district
        """
        return [n for n in g.nodes if g.nodes[n]["district"] == district_label]

    def __get_district_subgraph(self, g, district_label):
        """
            Given a nx.graph and a district_label
            Return a subgraph view (not clone) corresponding to the precincts in that district
        """
        relevant_nodes = self.__get_district_nodes(g, district_label)
        return g.subgraph(relevant_nodes)

    def __district_size(self, potential_district):
        """
            Given a potential district of nodes, using the population size of the district
            Return the population size of the district
        """
        return reduce(lambda total, precinct: total + int(potential_district.nodes[precinct]["population"]),
                      potential_district.nodes(), 0)

    def __is_valid_district_plan(self, edge, mst_combined_subgraph, g):
        """
            For a given potential edge cut on an MST in the ReCom algorithm,
            Determine whether a series of required conditions is satisfied, including:
                1. Population size after new districting,
        """
        # 1. Check the population size after this cut
        # Does cutting this edges create two components with similar population sizes?
        (tail, head) = edge
        mst_combined_subgraph.remove_edge(tail, head)
        components = list(nx.connected_components(mst_combined_subgraph))
        comp_1 = g.subgraph(components[0])
        comp_2 = g.subgraph(components[1])
        pop_total = abs(self.__district_size(comp_1) + self.__district_size(comp_2))
        pop_diff = abs(self.__district_size(comp_1) - self.__district_size(comp_2))
        # Add edge back in case this doesn't work
        mst_combined_subgraph.add_edge(tail, head)
        return pop_diff < (MAX_POP_DIFFERENCE_PERCENTAGE * pop_total)

    def __update_new_districts_with_cut(self, edge, mst_combined_subgraph, g, d1, d2):
        """
            After chcecking that an edge chould be cut to create new districts after combining into a single mega-district
            Redistrict the new components accordingly
        """
        (tail, head) = edge
        mst_combined_subgraph.remove_edge(tail, head)
        components = list(nx.connected_components(mst_combined_subgraph))
        comp_1 = g.subgraph(components[0])
        comp_2 = g.subgraph(components[1])
        for node in comp_1.nodes:
            g.nodes[node]["district"] = d1
        for node in comp_2.nodes:
            g.nodes[node]["district"] = d2

    def recombination_of_districts(self, i):
        """
            Given a graph
            Perform the recombination algorithm described in https://mggg.org/va-report.pdf
            ("Comparison of Districting Plans for the Virginia House of Delfates"; Metric Geometry and Gerrymandering Group; Section 2.3.2)
            Alternative resource: the recombination algorithm described in https://arxiv.org/pdf/1911.05725.pdf
            ("Recombination: A family of Markov chains for redistricting"; Daryl DeFord, Moon Duchin, and Justin Solomon)
        """
        # print("hello")
        graph = self.g.copy()
        # Randomly sample a district
        d1_label = self.__random_district_label(self.all_districts)
        d1 = self.__get_district_subgraph(graph, d1_label)
        # Select one of its neighboring districts
        d2 = self.__find_neighboring_district(graph, d1)
        d2_label = d2.nodes[self.__random_district_label(d2.nodes)]["district"]
        combined_subgraph = graph.subgraph(list(d1.nodes) + list(d2.nodes))
        cuttable = False
        attempt_count = 0
        while cuttable is False:
            mst_combined_subgraph = self.__random_spanning_tree(combined_subgraph)
            # For all edges in the MST
            for edge in mst_combined_subgraph.edges:
                # If cutting this edge produces a valid districting
                cond = self.__is_valid_district_plan(edge, mst_combined_subgraph, graph)
                if (cond):
                    cuttable = True
                    self.__update_new_districts_with_cut(edge, mst_combined_subgraph, graph, d1_label, d2_label)
                    self.g = graph
                    return graph
                if (attempt_count == 1000):
                    print("WARNING: Failed to make a recom after > 1000 iterations") if self.verbose else None
                    self.g = graph
                    return graph
                else:
                    attempt_count += 1
                    (tail, head) = edge
                    mst_combined_subgraph.add_edge(tail, head)

    def __random_spanning_tree(self, graph):
        """
            Given a graph
            Return a random spanning tree
        """
        for edge in graph.edges:
            graph.edges[edge]["weight"] = random.random()

        spanning_tree = tree.maximum_spanning_tree(
            graph, algorithm="kruskal", weight="weight"
        )
        return spanning_tree

    def __record_key_stats(self, graph, is_original_plan=False):
        """
            Given a potential districting plan (graph) and an optional flag for saying this is the original plan,
            Update our local data record to include stats for this plan

            data object:
            eg : efficiency gap measure
            pop_score : equal population measure
            pop_score_diff : alt. population measure
            obj_score : objective function score
            num_opportunity : number of opportunity districts in districting plan
            r_districts : number of districts that voted republican
            d_districts : number of districts that voted democrat
        """
        data_obj = {}
        pop_scores_diff = self.__pop_score_diff(graph)
        data_obj["eg"] = self.__efficiency_gap(graph)
        data_obj["pop_score"] = self.__population_score(graph)
        data_obj["total_pop_score_diff"] = pop_scores_diff[0]
        data_obj["vap_pop_score_diff"] = pop_scores_diff[1]
        data_obj["cvap_pop_score_diff"] = pop_scores_diff[2]
        data_obj["obj_score"] = self.__objective_score(data_obj["pop_score"], data_obj["eg"])
        data_obj["num_opportunity"] = self.__num_opportunity_districts(graph)
        data_obj["d_districts"] = self.__count_votes(graph, "D")
        data_obj["r_districts"] = self.__count_votes(graph, "R")
        if is_original_plan:
            self.original_data = data_obj
        else:
            self.data.append(data_obj)

    def __pop_score_diff(self, graph):
        scores = []  # 0: total 1: vap 2: cvap
        total_district_mapping = {}
        vap_district_mapping = {}
        cvap_district_mapping = {}
        for district_label in self.all_districts:
            total_district_mapping[district_label] = 0
            vap_district_mapping[district_label] = 0
            cvap_district_mapping[district_label] = 0
        for precinct_label in graph.nodes:
            precinct = graph.nodes[precinct_label]
            total_district_mapping[precinct['district']] += precinct['population']
            vap_district_mapping[precinct['district']] += precinct['vap_population']
            cvap_district_mapping[precinct['district']] += precinct['population']
        scores.append((max(total_district_mapping.values()) - min(total_district_mapping.values())) / sum(total_district_mapping.values()))
        scores.append((max(vap_district_mapping.values()) - min(vap_district_mapping.values())) / sum(vap_district_mapping.values()))
        scores.append((max(cvap_district_mapping.values()) - min(cvap_district_mapping.values())) / sum(cvap_district_mapping.values()))
        return scores

    def __num_opportunity_districts(self, graph):
        # TODO: Add VAP and CVAP calculations for opportunity districts
        num_opportunity_districts = 0
        # aggregate district total and minority populations
        district_mapping = {}
        for district_label in self.all_districts:
            district_mapping[district_label] = [0, 0]  # index 0: population, index 1: minority population
        for precinct_label in graph.nodes:
            precinct = graph.nodes[precinct_label]
            district_mapping[precinct['district']][0] += precinct['population']
            district_mapping[precinct['district']][1] += precinct['minority_pop']
        for districtPop in district_mapping.values():
            if districtPop[1] >= (districtPop[0] // 2):  # if minority population makes up 50% or more of total
                num_opportunity_districts += 1
        return num_opportunity_districts

    def __population_score(self, graph):
        # aggregate district populations
        district_mapping = {}
        for district_label in self.all_districts:
            district_mapping[district_label] = 0
        for precinct_label in graph.nodes:
            precinct = graph.nodes[precinct_label]
            district_mapping[precinct['district']] += precinct['population']

        # calculate ideal population
        ideal_pop = sum(district_mapping.values()) // len(self.all_districts)

        # calculate population score
        pop_score = 0
        for districtPop in district_mapping.values():
            pop_score += ((districtPop / ideal_pop) - 1) ** 2
        pop_score = pop_score ** 0.5

        return pop_score

    def __objective_score(self, pop_score, eg):
        """
        Measures: Population Equality, Efficiency Gap Measure
        Weights:           75                     25

        data normalization:
        new_score = (old_score - minimum) / (maximum - minimum)
        """
        pop_score_weight = 75  # population equality weight
        eg_weight = 25  # efficiency gap measure weight

        # normalizing Population Equality to 0-1 scale:
        # max/best = 0, min/worst = 1
        pop_score_normalized = (pop_score - 1) / (0 - 1)

        # normalizing Efficiency Gap Measure to 0-1 scale:
        # max/best = 0, min/worst = 0.5
        eg_normalized = (eg - 0.5) / (0 - 0.5)

        objective_score = pop_score_weight * pop_score_normalized + eg_weight * eg_normalized
        return objective_score

    def __winning_party_for_district(self, graph, district_label):
        """
            Given a graph and a district label,
            Return the party with the most precint votes
        """
        district = self.__get_district_subgraph(graph, district_label)
        # TODO: Update to use more than two parties
        demo_count = reduce(lambda demo_count, n_label: demo_count + 1 if district.nodes[n_label][
                                                                              "voting_history"] == "D" else demo_count - 1,
                            district.nodes, 0)
        if demo_count == 0:
            return None
        elif demo_count < 0:
            return "R"
        else:
            return "D"

    def __count_votes(self, graph, party):
        """
            Given a graph and party,
            Return the number of districts that voted for that party
        """
        return reduce(
            lambda count, d_label: count + 1 if self.__winning_party_for_district(graph, d_label) == party else count,
            self.all_districts, 0)

    # def plot_data(self):
    #     plt.hist([d["eg"] for d in self.data], bins="auto", alpha=0.5, facecolor='blue')
    #     plt.title("Efficiency Gap")
    #     plt.axvline(self.original_data["eg"], label="Original Plan")
    #     plt.legend()
    #     # plt.show()
    #     plt.savefig('efficiency_gap.png')
    #     plt.clf()
    #     plt.hist([d["d_districts"] for d in self.data], bins=5, range=(0,4), alpha=0.5, facecolor='blue')
    #     plt.title("Democratic Districts")
    #     plt.axvline(self.original_data["d_districts"], label="Original Plan")
    #     plt.legend()
    #     # plt.show()
    #     plt.savefig('democratic_districts.png')
    #     plt.clf()
    #     plt.hist([d["r_districts"] for d in self.data], bins=5, range=(0,4), alpha=0.5, facecolor='blue')
    #     plt.title("Republican Districts")
    #     plt.axvline(self.original_data["r_districts"], label="Original Plan")
    #     plt.legend()
    #     # plt.show()
    #     plt.savefig('republican_districts.png')
    #     plt.clf()

    def __aggregate_min_pop(self, graph, minority, min_list):
        """
        For each minority/political affiliation in this specific redistricting,
        aggregate the precinct level populations into districts
        add the district populations into the class lists
        """
        minority_pop_district = []
        for district_label in self.all_districts:
            minority_pop_district.append(sum(graph.nodes[node][minority] for node in graph.nodes
                                             if graph.nodes[node]['district'] == district_label))
        min_list.append(sorted(minority_pop_district))

    def __update_box_lists(self, graph):
        # see __aggregate_min_pop
        # total
        self.__aggregate_min_pop(graph, "black_pop", self.district_black_pops)
        self.__aggregate_min_pop(graph, "hispanic_pop", self.district_hispanic_pops)
        self.__aggregate_min_pop(graph, "american_indian_pop", self.district_american_indian_pops)
        self.__aggregate_min_pop(graph, "asian_pop", self.district_asian_pops)
        self.__aggregate_min_pop(graph, "hawaiian_pop", self.district_hawaiian_pops)
        self.__aggregate_min_pop(graph, "other_pop", self.district_other_pops)
        # vap
        self.__aggregate_min_pop(graph, "vap_black", self.district_vap_black_pops)
        self.__aggregate_min_pop(graph, "vap_hispanic", self.district_vap_hispanic_pops)
        self.__aggregate_min_pop(graph, "vap_american_indian", self.district_vap_american_indian_pops)
        self.__aggregate_min_pop(graph, "vap_asian", self.district_vap_asian_pops)
        self.__aggregate_min_pop(graph, "vap_hawaiian", self.district_vap_hawaiian_pops)
        self.__aggregate_min_pop(graph, "vap_other", self.district_vap_other_pops)
        # cvap
        self.__aggregate_min_pop(graph, "cvap_black", self.district_cvap_black_pops)
        self.__aggregate_min_pop(graph, "cvap_hispanic", self.district_cvap_hispanic_pops)
        self.__aggregate_min_pop(graph, "cvap_american_indian", self.district_cvap_american_indian_pops)
        self.__aggregate_min_pop(graph, "cvap_asian", self.district_cvap_asian_pops)
        self.__aggregate_min_pop(graph, "cvap_hawaiian", self.district_cvap_hawaiian_pops)
        self.__aggregate_min_pop(graph, "cvap_other", self.district_cvap_other_pops)
        # Election Data
        self.__aggregate_min_pop(graph, "democrat_voting", self.district_democrat_pops)
        self.__aggregate_min_pop(graph, "republican_voting", self.district_republican_pops)

    def __write_box_data_json(self, process_number):
        """
        Taking all the sorted minority population districts aggregated for each districting plan,
        add them to a dictionary, and write it out to JSON
        """
        min_dict = {'black_pop': self.district_black_pops, 'hispanic_pop': self.district_hispanic_pops,
                    'american_indian_pop': self.district_american_indian_pops, 'asian_pop': self.district_asian_pops,
                    'hawaiian_pop': self.district_hawaiian_pops, 'other_pop': self.district_other_pops,
                    'vap_black': self.district_vap_black_pops, 'vap_hispanic': self.district_vap_hispanic_pops,
                    'vap_american_indian': self.district_vap_american_indian_pops,
                    'vap_asian': self.district_vap_asian_pops,
                    'vap_hawaiian': self.district_vap_hawaiian_pops, 'vap_other': self.district_vap_other_pops,
                    'cvap_black': self.district_cvap_black_pops, 'cvap_hispanic': self.district_cvap_hispanic_pops,
                    'cvap_american_indian': self.district_cvap_american_indian_pops,
                    'cvap_asian': self.district_cvap_asian_pops,
                    'cvap_hawaiian': self.district_cvap_hawaiian_pops, 'cvap_other': self.district_cvap_other_pops,
                    'democrat_voting': self.district_democrat_pops, 'republican_voting': self.district_republican_pops}

        name = "box_whisker" + "/recom" + "_" + str(process_number) + ".json"
        with open(name, 'w', encoding="utf-8") as file:
            file.write(json.dumps(min_dict))

    def generate_alternative_plans(self, rounds, processNumber, outputPath):
        # Run `cooling`-many rounds to randomize the plan a bit
        # self.__drawGraph(self.g, "output/original")
        for i in range(0, self.cooling_period):
            print("Randomizing the seed plan", i) if i % 25 == 0 and self.verbose else None
            graph = self.recombination_of_districts(i)
            self.__update_box_lists(graph)

        # Run `rounds`-many recombinations to build a distribution of a few key stats
        for i in range(0, rounds):
            graph = self.g
            self.__record_key_stats(graph)
            graph_stats = self.data[-1]
            # write out graph
            fname = outputPath + "/original" + "_" + str(processNumber) + "_" + str(i) + ".json"
            with open(fname, 'w', encoding="utf-8") as file:
                file.write(json.dumps(json_graph.adjacency_data(graph)))

            # write out statistics for each graph
            sname = outputPath + "/original_statistics" + "_" + str(processNumber) + "_" + str(i) + ".json"
            with open(sname, 'w', encoding="utf-8") as file:
                file.write(json.dumps(graph_stats))

            print("Finding recomb ... ", i) if i % 20 == 0 and self.verbose else None
            graph = self.recombination_of_districts(i)

            # record statistics for each graph
            self.__record_key_stats(graph)

            # if it fits our strict filtering
            graph_stats = self.data[-1]
            if graph_stats['eg'] < 0.015 or \
                    graph_stats['pop_score'] < 0.020 or \
                    graph_stats['obj_score'] < 95:
                # write out graph
                fname = outputPath + "/recom" + "_" + str(processNumber) + "_" + str(i) + ".json"
                with open(fname, 'w', encoding="utf-8") as file:
                    file.write(json.dumps(json_graph.adjacency_data(graph)))

                # write out statistics for each graph
                sname = outputPath + "/recom_statistics" + "_" + str(processNumber) + "_" + str(i) + ".json"
                with open(sname, 'w', encoding="utf-8") as file:
                    file.write(json.dumps(graph_stats))

            # save minority/political populations in each district to each class list
            self.__update_box_lists(graph)

        # writes out the box and whisker plot data into a json file, each process will make one
        # MERGE EACH JSON FILE TO CREATE BOX AND WHISKER PLOT DATA
        self.__write_box_data_json(processNumber)

        print("DONE Finding alternative district plans") if self.verbose else None
