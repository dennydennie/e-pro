import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Text } from "@chakra-ui/react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

export interface CustomTableProps {
    data: any[];
    columns: ColumnDef<any, any>[];
    handleRowClick: (id: string) => void;
}

const CustomTable = ({ data, columns, handleRowClick }: CustomTableProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <TableContainer>
            <Table variant="simple">
                <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <Tr>
                            <Td colSpan={columns.length} textAlign="center">
                                <Box p={4}>
                                    <Text color="gray.500">No data available</Text>
                                </Box>
                            </Td>
                        </Tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <Tr key={row.id} onClick={() => handleRowClick(row.original.id)} cursor="pointer">
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    )}
                </Tbody>
                <Tfoot>
                    {table.getFooterGroups().map((footerGroup) => (
                        <Tr key={footerGroup.id}>
                            {footerGroup.headers.map((header) => (
                                <Th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.footer, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Tfoot>
            </Table>
        </TableContainer>
    );
}

export default CustomTable;