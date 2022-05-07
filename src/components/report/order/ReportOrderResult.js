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
                  Time Unit
                </TableCell>
                <TableCell>
                  Orders
                </TableCell>
                <TableCell>
                  Completed Orders
                </TableCell>
                <TableCell>
                  Products
                </TableCell>
                <TableCell>
                  Items
                </TableCell>
                <TableCell>
                  Order Total
                </TableCell>
                <TableCell>
                  Delivery fee
                </TableCell>
                <TableCell>
                  Revenue
                </TableCell>
              </>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                hover
                key={report.id}
                selected={selectedReportIds.indexOf(report._id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedReportIds.indexOf(report._id) !== -1}
                    onChange={(event) => handleSelectOne(event, report._id)}
                    value="true"
                  />
                </TableCell>
                <TableCell>
                  {report._id}
                </TableCell>
                <TableCell>
                  {report.orderNumber}
                </TableCell>
                <TableCell>
                  {report.completedOrder}
                </TableCell>
                <TableCell>
                  {report.productNumber}
                </TableCell>
                <TableCell>
                  {report.itemNumber}
                </TableCell>
                <TableCell>
                  $
                  {report.orderTotal}
                </TableCell>
                <TableCell>
                  $
                  {report.deliveryFee}
                </TableCell>
                <TableCell>
                  $
                  {report.revenue}
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
