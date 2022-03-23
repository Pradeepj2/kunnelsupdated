import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { toggle_retention_modal } from '../../../redux/actions/fetchActions';
import axios from 'axios';

const CreateRetention = ({
  toggle_retention_modal,
  modalRetShow,
  laboursData,
}) => {
  const { register, handleSubmit, errors } = useForm({ mode: 'onTouched' });

  const onSubmit = (data) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/wagemanage/retention/`,
        { labourer_id: data.labourer_id, amount: data.amount },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        toggle_retention_modal(false);
        window.location.reload();
      })
      .catch((error) => {
        toggle_retention_modal(false);
        alert(error);
      });
  };
  return (
    <Modal show={modalRetShow} onHide={() => toggle_retention_modal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Create Retention</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form key={1} onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="labourer_id">
            <Form.Label>Labour Id</Form.Label>
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
                ? laboursData.map((item) => {
                    const { id, labourerid } = item;
                    return (
                      <option key={id} value={id}>
                        {labourerid}
                      </option>
                    );
                  })
                : null}
            </Form.Control>
          </Form.Group>
          {errors.labourerId?.type === 'required' && (
            <p className="text-danger">
              <small>
                <i>This field is required</i>
              </small>
            </p>
          )}
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="text"
              name="amount"
              placeholder="Enter the Amount"
              ref={register({
                required: true,
              })}
            ></Form.Control>
          </Form.Group>
          {errors.amount?.type === 'required' && (
            <p className="text-danger">
              <small>
                <i>This field is required</i>
              </small>
            </p>
          )}
          <Button type="submit" className="btn btn-sm">
            Create
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
const mapStateToProps = (state) => ({
  modalRetShow: state.modalRetShow,
  laboursData: state.laboursData,
});
export default connect(mapStateToProps, { toggle_retention_modal })(
  CreateRetention
);
