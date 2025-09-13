import { useQuery } from 'react-query';
import { getAdmins } from './api';


export const useGetAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: () => getAdmins(),
  });
};
 
