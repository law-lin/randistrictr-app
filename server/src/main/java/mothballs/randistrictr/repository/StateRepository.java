package mothballs.randistrictr.repository;

import mothballs.randistrictr.model.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends JpaRepository<State, String> {
    State findStateByState(String stateName);
}
