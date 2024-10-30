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
