import _ from 'lodash';

export const formatStudentName = studentName => {
  const studentNameSpilt = _.split(studentName, ' ');

  studentNameSpilt.map((data, index) => {
    // loop through array
    if (!data.includes('/')) {
      studentNameSpilt[index] = _.capitalize(data);
    } else {
      studentNameSpilt[index] = _.toLower(data);
    }
  });

  const newStudentName = _.join(studentNameSpilt, ' ');

  return newStudentName;
};
