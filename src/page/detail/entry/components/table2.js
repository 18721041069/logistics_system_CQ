import React, { PureComponent } from 'react';

import 'antd/dist/antd.css';
import {
    Table, Input, Button, Icon,
} from 'antd';
import Highlighter from 'react-highlight-words';

import {actionCreators} from "../store";
import {connect} from "react-redux";

const title = () => '进销存卡信息';
const footer = () => '进销存卡信息';

class InfoTable extends PureComponent {

    componentWillMount() {
        this.props.getTableData();
    }

    state = {
        searchText: '',
        title: title,
        footer: footer,
    };

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
                             setSelectedKeys, selectedKeys, confirm, clearFilters,
                         }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { this.searchInput = node; }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    取消
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {

        let tableColumns = [];
        for (let i = 0, length = this.props.columns.length; i < length; i++) {
            let item = this.props.columns[i];
            tableColumns.push({
                title: item.name,
                dataIndex: item.name,
                key: item.name,
                ...this.getColumnSearchProps(item.name)
            })
        }

        const {  showWhichList } = this.props;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        style={{ marginRight: 30 }}
                    >
                        进销存卡
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => showWhichList(1)}
                        style={{background: 'grey'}}
                    >
                        入库单
                    </Button>
                </div>
                <Table
                    {...this.state}
                    columns={tableColumns}
                    dataSource={this.props.data}
                />
            </div>
        )
    }
}

const mapState = (state) => ({
    columns: state.getIn(['entry', 'columns2']),
    data: state.getIn(['entry', 'entry_data_2']),
});

const mapDispatchToProps = (dispatch) => ({
    showWhichList(listnumber){
        dispatch(actionCreators.showWhichList(listnumber));
    },
    getTableData(){
        dispatch(actionCreators.getTable2Data());
    }
});

export default connect(mapState, mapDispatchToProps)(InfoTable);
