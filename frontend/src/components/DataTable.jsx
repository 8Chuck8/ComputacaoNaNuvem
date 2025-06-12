import $ from 'jquery';
import { useEffect, useRef } from 'react';
import toast from "react-hot-toast";

const DataTableComponent = (props) => {
    const tableRef = useRef();

    const $table = $(tableRef.current);

        if ($.fn.DataTable.isDataTable($table)) {
        $table.DataTable().clear().destroy();
        }
        
        if (props.content_data && props.content_data.length > 0) {

            const table = $(tableRef.current).DataTable({
                lengthChange: false,
                order: false,
                scrollX: true,      
                scrollY: '400px',    
                scrollCollapse: true,
                paging: true,
                lengthChange: false,
                pageLength: 5
            });
    
            return () => {
                table.destroy();
            };
        }
    }, [props.content_data]);
    

    const excludedHeaders = ["_id", "updatedAt", "__v", "password"];
    const filteredHeaders = props.content_headers?.filter(
        (header) => !excludedHeaders.includes(header)
    );

    const handleDeleteContent = async (id) => {
        let endpoint = '';

        if (props.type === 'user') {
            endpoint = `/api/users/${id}`;
        } else if (props.type === 'question') {
            endpoint = `/api/questions/${id}`;
        } else if (props.type === 'answer') {
            endpoint = `/api/answers/${id}`;
        } else {
            toast.error("Unknown delete type");
            return;
        }

        try {
            const res = await fetch(endpoint, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
            toast.success(`${props.type} deleted`);
            window.location.reload();
            props.onDataChanged?.(); 
            } else {
            toast.error(data.message || "Delete failed");
            }
        } catch (err) {
            toast.error("Server error");
            console.error(err);
        }
    };

    return (
        <> 
            <table ref={tableRef} className="table table-bordered table-striped">
                <thead>
                    <tr>
                        {filteredHeaders && filteredHeaders.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.content_data && props.content_data.map((content, index) => (
                        <tr key={index}>
                            {filteredHeaders.map((key, idx) => (
                                <td key={idx}>
                                    {Array.isArray(content[key]) ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {content[key].map((item, subIdx) => (
                                                <p key={subIdx} className="mb-0">{item}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        key.toLowerCase().includes('date')
                                        ? new Date(content[key]).toLocaleDateString('en-GB') // formats as DD/MM/YYYY
                                        : content[key]
                                    )}
                                </td>
                            ))}
                            <td className="d-flex gap-2 justify-content-center">
                                <button onClick={() => props.handleEditContent(content._id)} className="btn btn-warning">Edit</button>
                                <button onClick={() => props.handleDeleteContent(content._id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default DataTableComponent;
