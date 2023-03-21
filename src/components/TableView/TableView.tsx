import { Table } from "antd";
import _ from "lodash";
import "./override.css";
import { ITableViewProp } from "./TableView.interface";
import styles from "./TableView.module.css";

export const TableView = (props: ITableViewProp) => {
  const { initialValue, label = "" } = props;
  let tableData = _.isEmpty(initialValue) ? [] : initialValue;


  tableData = _.map(tableData, (tableRow) => _.mapValues(tableRow, (value: any, key) => {
    if (_.isObject(value) || _.isArray(value)) {
      return JSON.stringify(value);
    }
    return value
  }))
  const columnsObj = _.keys(_.get(tableData, [0], {}));

  const tableColumns = _.map(columnsObj, (column) => {
    return {
      dataIndex: column,
      title: _.startCase(column),
      key: column,
    }
  });

  return (
    <div className="overflow-a">
    <div className="TableView">
      <div className={styles.TableContainer}>
        {!_.isEmpty(label) && <div className={styles.LabelForGrid}>{label}</div>}
        <Table
          columns={tableColumns}
          dataSource={tableData}
          scroll={{x:true}}
        />
      </div>
    </div>
    </div>
  )
}
