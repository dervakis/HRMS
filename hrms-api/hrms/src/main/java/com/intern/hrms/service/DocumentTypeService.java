package com.intern.hrms.service;

import com.intern.hrms.entity.travel.DocumentType;
import com.intern.hrms.repository.DocumentTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentTypeService {

    private final DocumentTypeRepository documentTypeRepository;

    public DocumentTypeService(DocumentTypeRepository documentTypeRepository) {
        this.documentTypeRepository = documentTypeRepository;
    }

    public DocumentType createDocumentType(String typeName){
        documentTypeRepository.findDocumentTypeByDocumentTypeName(typeName).ifPresent(
                type -> {throw new RuntimeException("Document Type Already Available : " + type.getDocumentTypeName());}
        );
                return documentTypeRepository.save(new DocumentType(typeName.toUpperCase()));
    }

    public List<DocumentType> getDocumentTypes(){
        return documentTypeRepository.findAll();
    }
}
