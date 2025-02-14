import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import * as action_attendance from '../../../actions/attendances';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Label,
  TextArea,
  Message
} from 'semantic-ui-react';
import firebase from 'firebase/compat/app';
import {
  MSG_BODY_FOR_NA,
  MSG_FEEDBACK_PLACEHOLDER,
  MSG_HEADER_FOR_NA
} from '../../../utils/common';
import InlineError from "../../messages/InlineError";
import {formatStudentName} from "../../../utils/util";

class EditAttendance extends React.Component {
  constructor(props) {
    super(props);
    const { attendance } = this.props;

    this.state = {
      data: {
        ...attendance
      },
      subjectList: [],
      statesList: [],
      students: [],
      errors: {}
    };
  }

  UNSAFE_componentWillMount() {
    const { data } = this.state;
    this.retrieveSubjectList(data.level);
    this.retrieveStatesList();
  }

  onSubmit = event => {
    const { updateAttendance, onBack } = this.props;
    const { data } = this.state;
    event.preventDefault();
    updateAttendance(data);
    onBack();
  };

  retrieveStatesList = () => {
    const list = [];
    const StatesRef = firebase
      .database()
      .ref('States')
      .orderByKey();
    StatesRef.on('value', data => {
      const states = [].concat(...Object.values(data.val()));
      states.forEach(stateInfo => {
        list.push(stateInfo.status);
      });
      this.setState({ statesList: list });
    });
  };

  retrieveSubjectList = (level) => {
    const list = [];
    const SubjectsRef = firebase.database().ref('Subjects');
    SubjectsRef.on('value', data => {
      const subjects = [].concat(...Object.values(data.val()));
      subjects.forEach(subject => {
        if(level === 'Primary' && subject.primary) {
          list.push(subject.Subject_Name);
        }  else if (level === "Secondary" && subject.secondary) {
          list.push(subject.Subject_Name);
        }
      });
      list.sort();
      this.setState({ subjectList: list });
    });
  };

  onChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  onChangeStudent = e => {
    const list = [];
    const { data } = this.state;
    const getStudentList = data.students;
    const keys = Object.keys(getStudentList);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const id = getStudentList[key].Id;
      const studentName = getStudentList[key].Name;
      const priLvl = getStudentList[key].Primary;
      const foundation = getStudentList[key].Foundation;
      const status = getStudentList[key].Status;
      const batch = getStudentList[key].Batch;

      const checked = `status_${studentName}`;

      let student = {};

      student = {
        Id: id,
        Name: studentName,
        Status: checked === e.target.name ? e.target.value : status
      };
      if (batch) {
        student.Batch = batch;
      }

      if (data.level === "Primary"){
        student.Primary = priLvl;
        if (foundation) {
          student.Foundation = foundation;
        }
      }
      else if(data.level === "Secondary") {
        student.Secondary = getStudentList[key].Secondary;
        student.Group = getStudentList[key].Group;
      }
      list.push(student);
    }

    this.setState({
      data: {
        ...this.state.data,
        students: list
      }
    });
  };

  renderEditForm = () => {
    const { data, subjectList, statesList, errors } = this.state;
    const SUBJECT_RADIO_FIELDS = subjectList
      ? subjectList.map(s => (
          <Form.Field
            key={s}
            label={s}
            control="input"
            type="radio"
            name="subject"
            value={s}
            checked={s === data.subject}
            onChange={this.onChange}
          />
        ))
      : null;

    const FORM_FIELD_SUBJECT = () => (
      <Form.Field error={!!errors.subject}>
        <label htmlFor="subject">Subject</label>
        <Form.Group>{SUBJECT_RADIO_FIELDS}</Form.Group>
      </Form.Field>
    );

    let counter = 0;
    const STUDENT_LIST = data.students.map(student => {
      const studentName = _.trim(student.Name);
      const newStudentName = formatStudentName(studentName);

      const STUDENT_LIST_FIELD = (
        <Form.Field key={student.Id}>
          <label htmlFor={studentName}>
            { data.level === 'Primary' ?
                `${(counter += 1)}. ${newStudentName} - P${student.Primary}` :
                `${(counter += 1)}. ${newStudentName} - Sec${student.Secondary} - ${student.Group}`
            }
            {student.Batch && (
              <Label basic color="blue" size="small" circular>
                Batch {student.Batch}
              </Label>
            )}
            {student.Foundation && (
              <Label basic color="orange" size="small" circular>
                Foundation: {student.Foundation}
              </Label>
            )}
          </label>

          <Form.Group>
            {statesList.map(state => (
              <Form.Field
                key={state}
                label={state}
                control="input"
                type="radio"
                name={`status_${studentName}`}
                value={state}
                checked={state === student.Status}
                onChange={this.onChangeStudent}
              />
            ))}
          </Form.Group>
        </Form.Field>
      );
      return STUDENT_LIST_FIELD;
    });

    const FORM_FIELD_STUDENT_LIST = () => (
      <Form.Field error={!!errors.students}>
        <label htmlFor="studentList">
          <u>Students</u>
        </label>
        {errors.students && <InlineError text={errors.students} />}
        {STUDENT_LIST}
      </Form.Field>
    );

    const FORM_FIELD_CLASSROOM_SETUP = () => (
      <Form.Field>
        <label htmlFor="classroomSetup">
          Are the classroom setup properly?
        </label>
        <Form.Group inline>
          <Form.Field
            label="Yes"
            control="input"
            type="radio"
            name="classroomSetup"
            value="Yes"
            checked={data.classroomSetup === 'Yes'}
            onChange={this.onChange}
          />
          <Form.Field
            label="No"
            control="input"
            type="radio"
            name="classroomSetup"
            value="No"
            checked={data.classroomSetup === 'No'}
            onChange={this.onChange}
          />
        </Form.Group>
      </Form.Field>
    );

    const FORM_FIELD_FEEDBACK = () => (
      <Form.Field error={!!errors.feedback}>
        <label htmlFor="feedback">{`Comment`}</label>

        <TextArea
          id="feedback"
          name="feedback"
          value={data.feedback}
          placeholder={MSG_FEEDBACK_PLACEHOLDER}
          onChange={this.onChange}
        />
        {errors.feedback && <InlineError text={errors.feedback} />}
      </Form.Field>
    );

    const SUBMIT_BUTTON = () =>
      errors.students ? null : data.students.length !== 0 ? (
        <Button primary fluid>
          Submit
        </Button>
      ) : null;

    const BACK_BUTTON = () => (
      <Button secondary fluid onClick={() => this.props.onBack()}>
        Back
      </Button>
    );

    let primaryStr = '';
    const primaryLevel = data.level === "Primary" && data.primary.forEach(value => {
      primaryStr += 'P' + value + ', ';
    });

    let groupStr = '';
    const groupIds = data.level === "Secondary" && data.group.forEach(value => {
      groupStr +=  value + ', ';
    });

    return (
      <Form
        key={`edit-form-${data.id}`}
        onSubmit={this.onSubmit}
        size="huge"
      >
        {BACK_BUTTON()}
        <hr />
        <Form.Input fluid label="Level" placeholder={data.level} readOnly />
        <Form.Input fluid label="Branch" placeholder={data.branch} readOnly />
        {data.batch && (
          <Form.Input fluid label="Branch" placeholder={data.batch} readOnly />
        )}
        {!data.relief && (
          <Form.Input
            fluid
            label="Teacher"
            placeholder={data.teacher}
            readOnly
          />
        )}
        {data.relief && (
          <Form.Input
            fluid
            label="Relief Teacher"
            placeholder={data.teacher}
            readOnly
          />
        )}

        {
          data.level === 'Primary' &&  <Form.Input
                  fluid
                  label="Primary"
                  placeholder={primaryStr.substring(0, primaryStr.length - 2)}
                  readOnly
              />
        }
        {
            data.level === 'Secondary' && [<Form.Input
                fluid
                label="Secondary"
                placeholder={data.secondary}
                readOnly
            />,
            <Form.Input
            fluid
            label="Group Ids"
            placeholder={groupStr.substring(0, groupStr.length - 2)}
            readOnly/>]
        }
        {FORM_FIELD_CLASSROOM_SETUP()}
        {
          data.level === "Secondary" ?
              <Form.Input
                  fluid
                  label="Subject"
                  placeholder={data.subject}
                  readOnly/> :
          FORM_FIELD_SUBJECT()}
        <Message
          info
          size="mini"
          header={MSG_HEADER_FOR_NA}
          list={MSG_BODY_FOR_NA}
        />
        {FORM_FIELD_STUDENT_LIST()}
        {FORM_FIELD_FEEDBACK()}
        {SUBMIT_BUTTON()}
      </Form>
    );
  };

  render() {
    return [
      <div className="edit-attendance-form">{this.renderEditForm()}</div>
    ];
  }
}

EditAttendance.propTypes = {
  onBack: PropTypes.func.isRequired
};

const mapStateToProps = ({ attendance }) => ({ attendance });

export default connect(mapStateToProps, action_attendance)(EditAttendance);
