package mothballs.randistrictr.repository;

import mothballs.randistrictr.model.Population;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PopulationRepository extends JpaRepository<Population, String> {

    Population findByGeoID20(String geoID20);
    List<Population> findAllByGeoID20Containing(String id);
    List<Population> findAllByGeoID20(String geoID20);

}
