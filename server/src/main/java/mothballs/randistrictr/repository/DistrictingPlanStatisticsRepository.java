package mothballs.randistrictr.repository;

import mothballs.randistrictr.model.DistrictingPlanStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictingPlanStatisticsRepository extends JpaRepository<DistrictingPlanStatistics, Integer> {
    public DistrictingPlanStatistics findById(String id);
}
