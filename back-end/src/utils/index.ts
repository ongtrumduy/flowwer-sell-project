import pick from 'lodash/pick';

export const getInformationData = ({
  fields = [],
  object = {},
}: {
  fields?: string[];
  object?: any;
}) => {
  return pick(object, fields);
};

import _ from 'lodash';

export const getInformationData_V2 = ({
  fields = [],
  object = {},
}: {
  fields?: string[];
  object?: any;
}) => {
  const result: any = {};

  // Duyệt qua từng trường trong fields
  fields.forEach((field) => {
    // Sử dụng _.get để lấy giá trị từ object
    const value = _.get(object, field);

    // Sử dụng _.set để gán giá trị vào kết quả
    _.set(result, field, value);
  });

  return result;
};
