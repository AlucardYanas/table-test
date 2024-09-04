// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import type { GridColDef, GridRowId } from '@mui/x-data-grid';
// import { DataGrid } from '@mui/x-data-grid';
// import { Button, Stack, Container } from '@mui/material';
// import useDocuments from '../hooks/useDocuments';

// export default function DataTable(): JSX.Element {


//   const [pageSize, setPageSize] = useState<number>(5);

//   // Мемоизация fetchDocuments, чтобы избежать изменения зависимости
//   const fetchDocumentsMemoized = useCallback(fetchDocuments, []);

//   useEffect(() => {
//     fetchDocumentsMemoized().catch(error => console.error('Error fetching documents:', error));
//   }, [fetchDocumentsMemoized]);

//   const handleAdd = () => {
//     const newDocument = {
//       companySigDate: new Date().toISOString(),
//       companySignatureName: 'New Company',
//       documentName: 'New Document',
//       documentStatus: 'New',
//       documentType: 'Type A',
//       employeeNumber: '12345',
//       employeeSigDate: new Date().toISOString(),
//       employeeSignatureName: 'John Doe',
//     };
//     addDocument(newDocument);
//   };





//   const columns: GridColDef[] = useMemo(() => [
//     { field: 'id', headerName: 'ID', width: 90 },
//     { field: 'companySigDate', headerName: 'Company Sig Date', width: 150 },
//     { field: 'companySignatureName', headerName: 'Company Signature Name', width: 150 },
//     { field: 'documentName', headerName: 'Document Name', width: 150 },
//     { field: 'documentStatus', headerName: 'Document Status', width: 150 },
//     { field: 'documentType', headerName: 'Document Type', width: 150 },
//     { field: 'employeeNumber', headerName: 'Employee Number', width: 150 },
//     { field: 'employeeSigDate', headerName: 'Employee Sig Date', width: 150 },
//     { field: 'employeeSignatureName', headerName: 'Employee Signature Name', width: 150 },
//   ], []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Container>
//       <div style={{ height: 400, width: '100%' }}>
//         <DataGrid 
//           rows={documents} 
//           columns={columns} 
//           paginationModel={{ pageSize }} 
//           onPaginationModelChange={(model) => setPageSize(model.pageSize)}
//           pageSizeOptions={[5, 10, 20]}
//           checkboxSelection
//           onRowSelectionModelChange={(ids) => setSelectedRowIds(ids)}
//         />
//       </div>
//       <Stack direction="row" spacing={2} justifyContent="center" marginTop={2}>
//         <Button variant="contained" color="primary" onClick={handleAdd}>
//           Add
//         </Button>
//         <Button variant="contained" color="secondary" onClick={handleEdit} disabled={selectedRowIds.length !== 1}>
//           Edit
//         </Button>
//         <Button variant="contained" color="error" onClick={handleDelete} disabled={selectedRowIds.length === 0}>
//           Delete
//         </Button>
//       </Stack>
//     </Container>
//   );
// }
import React, { useEffect, useState } from 'react';
import type { GridColDef, GridRowId } from '@mui/x-data-grid';
import { Container, Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import useDocuments from '../hooks/useDocuments';

export default function DataTable(): JSX.Element {
  const { documents, loading, fetchDocuments, addDocument, deleteDocuments, updateDocument } = useDocuments();
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]);

  useEffect(() => {
    fetchDocuments().catch(error => console.error('Error fetching documents:', error));
  }, [fetchDocuments]);

  const handleAdd = () => {
    const newDocument = {
      // id: uuidv4(),  // Генерация уникального id при добавлении новой записи
      companySigDate: new Date().toISOString(),
      companySignatureName: 'New Company',
      documentName: 'New Document',
      documentStatus: 'New',
      documentType: 'Type A',
      employeeNumber: '12345',
      employeeSigDate: new Date().toISOString(),
      employeeSignatureName: 'John Doe',
    };
    addDocument(newDocument);
  };

  const handleDelete = () => {
    const idsToDelete = selectedRowIds.map(id => id.toString());
    deleteDocuments(idsToDelete);
    setSelectedRowIds([]);  // Очищаем выбранные строки после удаления
  };

  const handleEdit = () => {
    if (selectedRowIds.length === 1) {
      const idToUpdate = selectedRowIds[0].toString();
      const updatedDocument = {
        companySigDate: new Date().toISOString(),
        companySignatureName: 'Updated Company',
        documentName: 'Updated Document',
        documentStatus: 'Updated',
        documentType: 'Type B',
        employeeNumber: '67890',
        employeeSigDate: new Date().toISOString(),
        employeeSignatureName: 'Jane Doe',
      };
      updateDocument(idToUpdate, updatedDocument);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'companySigDate', headerName: 'Company Sig Date', width: 150 },
    { field: 'companySignatureName', headerName: 'Company Signature Name', width: 150 },
    { field: 'documentName', headerName: 'Document Name', width: 150 },
    { field: 'documentStatus', headerName: 'Document Status', width: 150 },
    { field: 'documentType', headerName: 'Document Type', width: 150 },
    { field: 'employeeNumber', headerName: 'Employee Number', width: 150 },
    { field: 'employeeSigDate', headerName: 'Employee Sig Date', width: 150 },
    { field: 'employeeSignatureName', headerName: 'Employee Signature Name', width: 150 },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
          rows={documents} 
          columns={columns} 
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          getRowId={(row) => row.id || uuidv4()}
          onRowSelectionModelChange={(ids) => setSelectedRowIds(ids)}  // Обновляем состояние при изменении выбранных строк
        />
      </div>

      <Stack direction="row" spacing={2} justifyContent="center" marginTop={2}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
           Add
        </Button>
        <Button variant="contained" color="secondary" onClick={handleEdit} disabled={selectedRowIds.length !== 1}>
      Edit
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={selectedRowIds.length === 0}>
         Delete
       </Button> 
      </Stack>
    </Container>
  );
}
