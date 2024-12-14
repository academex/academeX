export const buildPaginationOptions = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const take = limit;

  return {
    skip,
    take,
  };
};
