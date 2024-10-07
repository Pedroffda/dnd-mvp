import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import WrapperCalendar from "@/components/Wrapper/WrapperCalendar";

const meta = {
  title: "Example/WrapperCalendar",
  component: WrapperCalendar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WrapperCalendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Calendar: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const calendar = canvas.getByRole("grid", { name: /Calendar/i });
    await expect(calendar).toBeInTheDocument();
  },  
};
