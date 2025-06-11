import $ from 'jquery';
import { useEffect, useRef } from 'react';

const DataTableComponent = (props) => {
    const tableRef = useRef();

    useEffect(() => {
        if (props.content_data && props.content_data.length > 0) {
            const table = $(tableRef.current).DataTable({
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
