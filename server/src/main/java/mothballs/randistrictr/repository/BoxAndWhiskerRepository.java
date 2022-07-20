package mothballs.randistrictr.repository;

import mothballs.randistrictr.model.BoxAndWhisker;
import mothballs.randistrictr.enums.Basis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoxAndWhiskerRepository extends JpaRepository<BoxAndWhisker, String> {
    BoxAndWhisker findByBasisAndState(Basis basis, String state);
}