import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Button, Tabs, Tab, Dropdown } from 'carbon-components-react';

import FlyoutMenu from './FlyoutMenu';

const directions = { Bottom: 'bottom', Top: 'top', Left: 'left', Right: 'right' };

const dropdownItems = [
  'Option 1',
  'Option 2',
  'Option 3',
  'Option 4',
  'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae, aliquam. Blanditiis quia nemo enim voluptatibus quos ducimus porro molestiae nesciunt error cumque quaerat, tempore vero unde eum aperiam eligendi repellendus.',
];

function UncontrolledExample() {
  const [isOpen, setIsOpen] = useState(false);
  const direction = select('Flyout direction', directions, 'bottom');

  return (
    <>
      <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
        <Button style={{ margin: '10px 5px' }} onClick={() => setIsOpen(false)}>
          Hide
        </Button>
        <Button style={{ margin: '10px 5px' }} onClick={() => setIsOpen(true)}>
          Show
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FlyoutMenu
          triggerId="flyout-test"
          open={isOpen}
          showIcon={false}
          direction={direction}
          onCancel={action('On Cancel Clicked')}
          onApply={action('On Apply Clicked')}
        >
          Example Content
        </FlyoutMenu>
      </div>
    </>
  );
}

function TabbedContent() {
  return (
    <div style={{}}>
      <Tabs>
        <Tab id="tab-1" label="Label 1">
          <div>This is some stuff</div>

          <Dropdown items={dropdownItems} />
        </Tab>

        <Tab id="tab-2" label="Label 2">
          <div>This is some more stuff</div>
        </Tab>
      </Tabs>
    </div>
  );
}

function ControlledExample() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FlyoutMenu
          triggerId="flyout-test"
          onCancel={action('On Cancel Clicked')}
          onApply={action('On Apply Clicked')}
          direction={select('Flyout direction', directions, 'bottom')}
        >
          <TabbedContent />
        </FlyoutMenu>
      </div>
    </>
  );
}

storiesOf('Watson IoT/Flyout Menu', module)
  .add('basic', () => <UncontrolledExample />)
  .add('Controlled example', () => <ControlledExample />);
