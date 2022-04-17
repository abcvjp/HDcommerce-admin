import { useState, useCallback, useContext } from 'react';
import { ReportOrderContext } from 'src/utils/contexts';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  LinearProgress
} from '@material-ui/core';

const ReportOrderResult = () => {
  const { state, dispatch } = useContext(ReportOrderContext);
  const [selectedReportIds, setSelectedReportIds] = useState([]);
  const { reports } = state;

  const handleLimitChange = useCallback((event) => {
    dispatch({
      type: 'CHANGE_PAGE_SIZE',
      pageSize: event.target.value
    });
  }, []);

  const handlePageChange = useCallback((event, newPage) => {
    dispatch({
      type: 'CHANGE_CURRENT_PAGE',
      currentPage: newPage
    });
  }, []);

  const handleSelectAll = (event) => {
    let newSelectedReportIds;

    if (event.target.checked) {
      newSelectedReportIds = reports.map((report) => report.id);
    } else {
      newSelectedReportIds = [];
    }

    setSelectedReportIds(newSelectedReportIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedReportIds.indexOf(id);
    let newSelectedReportIds = [];

    if (selectedIndex === -1) {
      newSelectedReportIds = newSelectedReportIds.concat(selectedReportIds, id);
    } else if (selectedIndex === 0) {
      newSelectedReportIds = newSelectedReportIds.concat(selectedReportIds.slice(1));
    } else if (selectedIndex === selectedReportIds.length - 1) {
      newSelectedReportIds = newSelectedReportIds.concat(selectedReportIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedReportIds = newSelectedReportIds.concat(
        selectedReportIds.slice(0, selectedIndex),
        selectedReportIds.slice(selectedIndex + 1)
      );
    }

    setSelectedReportIds(newSelectedReportIds);
  };

  return (
    <Card>
      <Box sx={{ minWidth: 1050 }}>
        {state.isLoading && <LinearProgress />}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedReportIds.length === reports.length}
                  color="primary"
                  indeterminate={
                      selectedReportIds.length > 0
                      && selectedReportIds.length < reports.length
                    }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <>
                <TableCell>
                  Time
                </TableCell>
                <TableCell>
                  Orders Number
                </TableCell>
                <TableCell>
                  Completed Orders
                </TableCell>
                <TableCell>
                  Item Total
                </TableCell>
                <TableCell>
                  Items Number
                </TableCell>
                <TableCell>
                  Shipping fee
                </TableCell>
                <TableCell>
                  Order Total
                </TableCell>
                <TableCell>
                  Profit (expected)
                </TableCell>
              </>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                hover
                key={report.id}
                selected={selectedReportIds.indexOf(report.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedReportIds.indexOf(report.id) !== -1}
                    onChange={(event) => handleSelectOne(event, report.id)}
                    value="true"
                  />
                </TableCell>
                <TableCell>
                  {report.time}
                </TableCell>
                <TableCell>
                  {report.orders_number}
                </TableCell>
                <TableCell>
                  {report.completed_orders_number}
                </TableCell>
                <TableCell>
                  $
                  {report.item_total}
                </TableCell>
                <TableCell>
                  {report.items_number}
                </TableCell>
                <TableCell>
                  $
                  {report.shipping_fee}
                </TableCell>
                <TableCell>
                  $
                  {report.order_total}
                </TableCell>
                <TableCell>
                  $
                  {report.expected_profit}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={state.count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={state.currentPage}
        rowsPerPage={state.pageSize}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default ReportOrderResult;
