import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardHeader, Col, Row } from 'react-bootstrap';
import AgentList from './components/AgentList';
import Fil  from "./components/fil"
export const metadata = {
  title: 'Agent List'
};
const ListViewPage = () => {
  return <>
    {/* <Fil/> */}
     <AgentList/>
    </>;
};
export default ListViewPage;