import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import React from 'react';

const Template = (args) => (
  <Tabs {...args}>
    <TabList>
      <Tab index={0}>Statistics</Tab>
      <Tab index={1}>Tools</Tab>
    </TabList>
    <TabPanel index={0}>Content 1</TabPanel>
    <TabPanel index={1}>Content 2</TabPanel>
  </Tabs>
);
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Extension/Tabs',
  component: Template,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout

  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    onChange: () => {},
  },
};
