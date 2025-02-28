import FileUpload from '@/components/FileUpload';
import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import AgentAdd from './components/AgentAdd';
import Studentadd from "./components/studentadd"
import AgentAddCard from './components/AgentAddCard';
export const metadata = {
  title: 'Add Agent'
};
const AgentAddPage = () => {


  return <>
      <PageTitle  title="Add Members" />
      <Row >
        {/* <AgentAddCard /> */}
        <Col xl={12} lg={8}  >
          {/* <FileUpload title="Add Agent Photo" /> */}
          <AgentAdd />
         {/* <Studentadd/> */}
        </Col>
      </Row>
    </>;
};
export default AgentAddPage;