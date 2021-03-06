import { mount } from 'enzyme';
import React from 'react';
import { Tooltip } from 'carbon-components-react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Popup16 } from '@carbon/icons-react';

import { CARD_SIZES, CARD_TITLE_HEIGHT, CARD_ACTIONS } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import CardRangePicker from './CardRangePicker';
import Card from './Card';

const { iotPrefix } = settings;

const tooltipElement = <div>This is some other text</div>;

const cardProps = {
  title: 'My Title',
  id: 'my card',
};

describe('Card', () => {
  it('small', () => {
    const wrapper = mount(<Card {...cardProps} size={CARD_SIZES.SMALL} />);

    // small should have full header
    expect(wrapper.find(`.${iotPrefix}--card--header`)).toHaveLength(1);
  });

  it('child size prop', () => {
    const childRenderInTitleCard = jest.fn();

    mount(
      <Card title="My Title" size={CARD_SIZES.MEDIUM}>
        {childRenderInTitleCard}
      </Card>
    );
    expect(childRenderInTitleCard).toHaveBeenCalledWith(
      {
        width: 0,
        height: -CARD_TITLE_HEIGHT,
        position: null,
      },
      expect.anything()
    );

    const childRenderInNoTitleCard = jest.fn();

    mount(<Card size={CARD_SIZES.MEDIUM}>{childRenderInNoTitleCard}</Card>);
    expect(childRenderInNoTitleCard).toHaveBeenCalledWith(
      {
        width: 0,
        height: 0,
        position: null,
      },
      expect.anything()
    );
  });

  it('render icons', () => {
    let wrapper = mount(
      <Card {...cardProps} size={CARD_SIZES.SMALL} availableActions={{ range: true }} />
    );
    // should render CardRangePicker if isEditable is false
    expect(wrapper.find(CardRangePicker)).toHaveLength(1);

    wrapper = mount(
      <Card
        {...cardProps}
        size={CARD_SIZES.SMALL}
        availableActions={{ range: true, expand: true }}
      />
    );

    // should render CardRangePicker and Expand
    expect(wrapper.find(CardRangePicker)).toHaveLength(1);
    expect(wrapper.find(Popup16)).toHaveLength(1);

    wrapper = mount(
      <Card {...cardProps} size={CARD_SIZES.SMALL} isEditable availableActions={{ range: true }} />
    );
    // CardRangePicker icon should not render if isEditable prop is true
    expect(wrapper.find(CardRangePicker)).toHaveLength(0);
  });

  it('additional prop based elements', () => {
    let wrapper = mount(<Card {...cardProps} size={CARD_SIZES.LARGE} tooltip={tooltipElement} />);
    // tooltip prop will render a tooltip in the header
    expect(wrapper.find(`.${iotPrefix}--card--header`).find(Tooltip)).toHaveLength(1);
    // without the isLoading prop SkeletonWrapper should not be rendered
    expect(wrapper.find(`.${iotPrefix}--card--skeleton-wrapper`)).toHaveLength(0);
    // with the isLoading prop SkeletonWrapper should  be rendered
    wrapper = mount(
      <Card {...cardProps} isLoading size={CARD_SIZES.SMALLWIDE} tooltip={tooltipElement} />
    );
    expect(wrapper.find(`.${iotPrefix}--card--skeleton-wrapper`)).toHaveLength(1);
  });
  it('isExpanded', () => {
    const wrapper = mount(
      <Card {...cardProps} isExpanded size={CARD_SIZES.LARGE} tooltip={tooltipElement} />
    );
    // isExpanded renders the modal wrapper around it
    expect(wrapper.find('.bx--modal')).toHaveLength(1);
  });
  it('card actions', () => {
    const mockOnCardAction = jest.fn();
    const wrapper = mount(
      <Card
        {...cardProps}
        isExpanded
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ expand: true }}
      />
    );
    wrapper
      .find(`.${iotPrefix}--card--toolbar-svg-wrapper`)
      .get(0)
      .props.onClick();
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.CLOSE_EXPANDED_CARD);

    mockOnCardAction.mockClear();
    const wrapper2 = mount(
      <Card
        {...cardProps}
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ expand: true }}
      />
    );
    wrapper2
      .find(`.${iotPrefix}--card--toolbar-svg-wrapper`)
      .get(0)
      .props.onClick();
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.OPEN_EXPANDED_CARD);
  });
  it('card editable actions', async () => {
    const mockOnCardAction = jest.fn();
    const { getByTitle, getByText } = render(
      <Card
        {...cardProps}
        isEditable
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ edit: true, clone: true, delete: true }}
      />
    );
    fireEvent.click(getByTitle('Open and close list of options'));
    // Click on the first overflow menu item
    const firstMenuItem = await waitFor(() => getByText('Edit card'));
    fireEvent.click(firstMenuItem);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.EDIT_CARD);
    mockOnCardAction.mockClear();
    // Reopen menu
    fireEvent.click(getByTitle('Open and close list of options'));
    const secondElement = await waitFor(() => getByText('Clone card'));
    fireEvent.click(secondElement);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.CLONE_CARD);

    // Reopen menu
    fireEvent.click(getByTitle('Open and close list of options'));
    mockOnCardAction.mockClear();
    const thirdElement = await waitFor(() => getByText('Delete card'));
    fireEvent.click(thirdElement);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, CARD_ACTIONS.DELETE_CARD);
  });
  it('card toolbar renders in header only when there are actions', () => {
    const wrapperWithActions = mount(
      <Card {...cardProps} isExpanded size={CARD_SIZES.SMALL} availableActions={{ expand: true }} />
    );
    expect(
      wrapperWithActions
        .getDOMNode()
        .querySelectorAll(`.${iotPrefix}--card--header .${iotPrefix}--card--toolbar`)
    ).toHaveLength(1);

    const wrapperWithoutActions = mount(<Card {...cardProps} isExpanded size={CARD_SIZES.SMALL} />);
    expect(
      wrapperWithoutActions
        .getDOMNode()
        .querySelectorAll(`.${iotPrefix}--card--header .${iotPrefix}--card--toolbar`)
    ).toHaveLength(0);
  });
});
