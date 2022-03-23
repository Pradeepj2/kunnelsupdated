import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Col, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { labours_list } from '../../../redux/actions/siteActions';
import {
  advance_types,
  apply_advance_modal,
} from '../../../redux/actions/fetchActions';
import axios from 'axios';
const ApplyAdvance = ({
  labours_list,
  advance_types,
  advanceTypes,
  laboursData,
  apply_advance_modal,
  applyAdvanceModal,
}) => {
  const { register, handleSubmit, errors } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/labourermanage/labourer/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }).then((res=>{
          labours_list(res.data.data);
        })
      )
      .catch((error) => {
        console.log('Error :', error);
      });
  }, [labours_list]);

  const onSubmit = (data) => {

    data = {...data,labourer_id:data.labourer_id.split("LAB00")[1]}

    axios
      .post(`${process.env.REACT_APP_API_URL}/advance/create_advance`, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          alert("Advance Created");
          apply_advance_modal({ show: false })
          window.location.reload();
        } else {
          alert("Error Occured");
        }
      })
      .catch((error) => {
        console.log('Error :', error);
      });
  };
  return (
    <Modal
      show={applyAdvanceModal}
      onHide={() => apply_advance_modal({ show: false })}
    >
      <Modal.Header closeButton>
        <Modal.Title>Apply For Advance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Form.Group as={Col} controlId="labourer_id">
              <Form.Label>Labourer Id</Form.Label>
              <Form.Control
                as="select"
                name="labourer_id"
                ref={register({
                  required: true,
                })}
              >
                <option key="0" value="">
                  Select
                </option>
                {!(Object.keys(laboursData).length === 0)
                  ? laboursData.map((labour) => {
                      const { id, labourerid } = labour;
                      return (
                        <option key={id} value={labourerid}>
                          {labourerid}
                        </option>
                      );
                    })
                  : null}
              </Form.Control>
              {errors.labourer_id?.type === 'required' && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                ref={register({
                  required: true,
                })}
              >
                <option key="0" value="">
                  Select
                </option>

                <option key="F" value="F">
                  Festival Advance
                </option>
                <option key="S" value="S">
                  Special Advance
                </option>
              </Form.Control>
              {errors.type?.type === 'required' && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                name="amount"
                placeholder="Enter Amount"
                ref={register({
                  required: true,
                })}
              ></Form.Control>
              {errors.amount?.type === 'required' && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="deduction_percent">
              <Form.Label>Advance Percentage</Form.Label>
              <Form.Control
                type="text"
                name="deduction_percent"
                placeholder="Enter Percentage"
                ref={register({
                  required: true,
                })}
              ></Form.Control>
              {errors.deduction_percent?.type === 'required' && (
                <p className="text-danger">
                  <small>
                    <i>This field is required</i>
                  </small>
                </p>
              )}
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit">
            Apply
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
const mapStateToProps = (state) => ({
  advanceTypes: state.advanceTypes,
  laboursData: state.laboursData,
  applyAdvanceModal: state.applyAdvanceModal,
});
export default connect(mapStateToProps, {
  labours_list,
  advance_types,
  apply_advance_modal,
})(ApplyAdvance);
