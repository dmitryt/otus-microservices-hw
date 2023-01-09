import { SagaBuilder } from 'node-sagas';

const sagaBuilder = new SagaBuilder<CreateOrderSagaParams>();

const saga = sagaBuilder
    .step('Create order')
    .invoke((params: CreateOrderSagaParams) => {
      // create order logic
    })
    .withCompensation((params: CreateOrderSagaParams) => {
      // reject order logic
    });

export default saga;
