

import PageTitle from '@/components/PageTitle';
import AddTask from './components/AddTask';
import { Col, Row } from 'react-bootstrap';

const AddTaskPage = () => {
  return <>
     <PageTitle subName="Student" title="Add Task" />
      <Row>
       
        <Col xl={9} lg={12}>
          <AddTask/>
        </Col>
      </Row>
    </>;
};

export default AddTaskPage;