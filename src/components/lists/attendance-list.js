import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Icon, Table} from 'semantic-ui-react';
import {AUDITOR_LAST_4_DIGIT} from "../../utils/common";

class AttendanceList extends React.Component {
    render() {
        const {attendances, user} = this.props;

        let is_auditor;
        const last4Digit = user.phoneNumber.slice(-4);
        is_auditor = AUDITOR_LAST_4_DIGIT.find(value => value === last4Digit);

        const records = Object.values(attendances);
        const has_primary = records.some(obj => obj.level === "Primary");
        const has_secondary = records.some(obj => obj.level === "Secondary");
        const has_both_level = has_primary && has_secondary;

        const renderAttendanceRow = () => {
            return Object.keys(attendances).map(key => {
                const attendanceObj = attendances[key];

                let primaryStr = '';
                let groupStr = '';
                if (attendanceObj.level === "Primary") {
                    attendanceObj.primary.forEach(value => {
                        primaryStr += 'P' + value + ', ';
                    });
                } else {
                    attendanceObj.group.forEach(value => {
                        groupStr += value + ", ";
                    });
                }
                return (
                    <React.Fragment key={key}>
                        <Table.Row key={'r' - key}>
                            {
                                attendanceObj.auditor ?
                                    <React.Fragment>
                                        <Table.Cell onClick={() => this.props.onEdit(attendanceObj)} rowSpan='2'>
                                            {attendanceObj.branch}
                                        </Table.Cell>
                                        <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                                            {attendanceObj.auditor}{' '}
                                            <Icon fitted color="blue" name="user secret"/>
                                        </Table.Cell></React.Fragment> :
                                    <React.Fragment>
                                        <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                                            {attendanceObj.branch}
                                        </Table.Cell>
                                        <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                                            {attendanceObj.teacher}{' '}
                                            {attendanceObj.relief && (
                                                <Icon fitted color="green" name="registered outline"/>
                                            )}
                                        </Table.Cell>
                                    </React.Fragment>

                            }

                            <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                                {attendanceObj.subject}
                            </Table.Cell>
                            {
                                attendanceObj.level === 'Primary' ?
                                    <React.Fragment>
                                        <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                                            {primaryStr.substring(0, primaryStr.length - 2)}
                                        </Table.Cell>
                                        {
                                            has_both_level &&
                                            <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>-</Table.Cell>
                                        }

                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                                            {'Sec ' + attendanceObj.secondary}
                                        </Table.Cell>
                                        <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                                            {groupStr.substring(0, groupStr.length - 2)}
                                        </Table.Cell>
                                    </React.Fragment>

                            }

                            <Table.Cell onClick={() => this.props.onEdit(attendanceObj)}>
                                <Icon circular name="edit" color="blue"/>
                                Modify
                            </Table.Cell>
                            <Table.Cell onClick={() => this.props.onDelete(attendanceObj)}>
                                <Icon circular name="close" color="red"/>
                                Remove
                            </Table.Cell>
                        </Table.Row>
                        {
                            attendanceObj.auditor &&
                            <Table.Row key={`remark-${key}`}>
                                <Table.Cell colSpan='6' onClick={() => this.props.onEdit(attendanceObj)}>
                                    {'Remark: ' + attendanceObj.feedback}
                                </Table.Cell>
                            </Table.Row>
                        }
                    </React.Fragment>
                );
            });
        };

        return (
            <Table celled unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Branch</Table.HeaderCell>
                        {is_auditor ?
                            <Table.HeaderCell>Teacher/Auditor Name</Table.HeaderCell> :
                            <Table.HeaderCell>Teacher Name</Table.HeaderCell>}
                        <Table.HeaderCell>Subject</Table.HeaderCell>
                        {
                            has_both_level ?
                                <React.Fragment>
                                    <Table.HeaderCell>Primary/Secondary</Table.HeaderCell>
                                    <Table.HeaderCell>Group</Table.HeaderCell>
                                </React.Fragment> :
                                <React.Fragment>
                                    {has_primary && <Table.HeaderCell>Primary</Table.HeaderCell>}
                                    {has_secondary && <React.Fragment>
                                        <Table.HeaderCell>Secondary</Table.HeaderCell>
                                        <Table.HeaderCell>Group</Table.HeaderCell>
                                    </React.Fragment>
                                    }
                                </React.Fragment>
                        }
                        <Table.HeaderCell textAlign="center" colSpan="2">Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{renderAttendanceRow()}</Table.Body>
                <Table.Footer>
                    <Table.Row textAlign="center">
                        <Table.HeaderCell colSpan='7'>
                            <b>* Click on the row to edit *</b> <br/>
                            {`Attendance will only show those marked on ${new Date().toDateString()}`}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}

AttendanceList.propTypes = {
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

const mapStateToProps = ({user, attendances}) => ({
    user,
    attendances
});

export default connect(mapStateToProps, null)(AttendanceList);
