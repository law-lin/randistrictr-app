package mothballs.randistrictr.repository;

import mothballs.randistrictr.model.DistrictingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictingPlanRepository extends JpaRepository<DistrictingPlan, Long>  {
}
