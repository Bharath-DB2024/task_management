'use client'
import ChoicesFormInput from '@/components/from/ChoicesFormInput'
import TextAreaFormInput from '@/components/from/TextAreaFormInput'
import TextFormInput from '@/components/from/TextFormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const AgentAdd = () => {
  const messageSchema = yup.object({
    name: yup.string().required('Please enter name'),
    description: yup.string().required('Please enter description'),
    zipCode: yup.string().required('Please enter Zip-Code'),
    email: yup.string().email().required('Please enter email'),
    number: yup.string().required('Please enter number'),
    propertiesNumber: yup.string().required('Please enter Properties Number'),
    facebookUrl: yup.string().required('Please enter Facebook Url'),
    instagramUrl: yup.string().required('Please enter Instagram Url'),
    twitterUrl: yup.string().required('Please enter Twitter Url'),
  })

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(messageSchema),
  })
  return (
    <form onSubmit={handleSubmit(() => {})}>
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Agent Information</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="name" placeholder="Full Name" label="Agent Name" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="email" placeholder="Enter Email" label="Agent Email" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="number" type="number" placeholder="Enter Number" label="Agent Number" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="propertiesNumber"
                  type="number"
                  placeholder="Enter Properties Number"
                  label="Properties Number"
                />
              </div>
            </Col>
            <Col lg={12}>
              <div className="mb-3">
                <TextAreaFormInput
                  control={control}
                  name="description"
                  type="text"
                  label="Agent Address"
                  className="agent-address"
                  id="schedule-textarea"
                  rows={3}
                  placeholder="Enter address"
                />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="zipCode" type="number" placeholder="Zip-Code" label="Zip-Code" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
              <TextFormInput control={control} name="city" type="text" className="form-control" id="choices-city" placeholder="Enter City" label="City" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
              <TextFormInput control={control} name="country" type="text"  className="form-control" id="choices-country" placeholder="Enter Country" label="Country" />
              </div>
            </Col>
            
          </Row>
        </CardBody>
      </Card>
      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button type="submit" variant="outline-primary" className="w-100">
              Create Agent
            </Button>
          </Col>
          <Col lg={2}>
            <Button variant="danger" className="w-100">
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  )
}

export default AgentAdd
