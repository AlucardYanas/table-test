import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

type DocumentData = {
  id: number;
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

export default function useDocuments(): { 
  documents: DocumentData[]; 
  loading: boolean;
  fetchDocuments: () => Promise<void>;
  addDocument: (newDocument: Omit<DocumentData, 'id'>) => Promise<void>;
  deleteDocuments: (ids: string[]) => Promise<void>;
  updateDocument: (id: string, updatedDocument: Omit<DocumentData, 'id'>) => Promise<void>;
} {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedDocuments = localStorage.getItem('documents');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
      setLoading(false);
    }
  }, []);

  // Сохраняем данные в localStorage при каждом обновлении
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('documents', JSON.stringify(documents));
    }
  }, [documents]);

  const fetchDocuments = useCallback(async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await axios.get<{ data: DocumentData[] }>(
        'https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/get',
        {
          headers: { 'x-auth': token || '' },
        }
      );
      if (Array.isArray(response.data.data)) {
        const documentsWithId = response.data.data.map((doc) => ({
          ...doc,
          id: doc.id || uuidv4(),
        }));
        setDocuments(documentsWithId);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDocument = useCallback(async (newDocument: Omit<DocumentData, 'id'>) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post<DocumentData>(
        'https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/create',
        { ...newDocument, id: uuidv4() },
        {
          headers: { 'x-auth': token || '' },
        }
      );
      
      setDocuments((prevDocuments) => [...prevDocuments, response.data]);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }, []);

  const deleteDocuments = useCallback(async (ids: string[]) => {
    const token = localStorage.getItem('token');
    try {
      const deletePromises = ids.map(async (id) => {
        await axios.post(
          `https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/delete/${id}`,
          {},
          {
            headers: { 'x-auth': token || '' },
          }
        );
      });

      await Promise.all(deletePromises);
      setDocuments((prevDocuments) => prevDocuments.filter(doc => !ids.includes(doc.id)));
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  }, []);

  const updateDocument = useCallback(async (id: string, updatedDocument: Omit<DocumentData, 'id'>) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post<DocumentData>(
        `https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/set/${id}`,
        updatedDocument,
        {
          headers: { 'x-auth': token || '' },
        }
      );
      setDocuments((prevDocuments) =>
        prevDocuments.map(doc => doc.id === id ? response.data : doc)
      );
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }, []);

  return {
    documents,
    loading,
    fetchDocuments,
    addDocument,
    deleteDocuments,
    updateDocument,
  } 
};
