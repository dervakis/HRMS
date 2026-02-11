package com.intern.hrms.repository;

import com.intern.hrms.entity.travel.ProvidedTravelDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvidedTravelDocumentRepository extends JpaRepository<ProvidedTravelDocument, Integer> {
}
