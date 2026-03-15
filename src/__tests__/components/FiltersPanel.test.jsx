import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FiltersPanel } from "../../components/FiltersPanel";

const mockJobs = [
  {
    id: 1,
    title: "Frontend Engineer",
    company: "Acme",
    location: "Remote",
    tags: ["react", "javascript"],
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Beta",
    location: "Berlin",
    tags: ["node", "javascript"],
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Gamma",
    location: "Remote",
    tags: ["product"],
  },
];

const baseFilters = { searchQuery: "", company: [], location: [], tags: [] };

function renderPanel(props = {}) {
  return render(
    <FiltersPanel
      jobs={mockJobs}
      filters={baseFilters}
      hasActiveFilters={false}
      onClearAll={vi.fn()}
      onToggleCompany={vi.fn()}
      onToggleLocation={vi.fn()}
      onToggleTag={vi.fn()}
      {...props}
    />,
  );
}

describe("FiltersPanel", () => {
  describe("rendering", () => {
    it("renders a chip for each unique company", () => {
      renderPanel();
      expect(screen.getByRole("button", { name: "Acme" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Beta" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Gamma" })).toBeInTheDocument();
    });

    it("renders a chip for each unique location", () => {
      renderPanel();
      expect(
        screen.getByRole("button", { name: "Remote" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Berlin" }),
      ).toBeInTheDocument();
    });

    it("renders a chip for each unique tag", () => {
      renderPanel();
      expect(screen.getByRole("button", { name: "react" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "javascript" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "node" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "product" }),
      ).toBeInTheDocument();
    });

    it('does not show "Clear all" when no filters are active', () => {
      renderPanel({ hasActiveFilters: false });
      expect(
        screen.queryByRole("button", { name: /clear all/i }),
      ).not.toBeInTheDocument();
    });

    it('shows "Clear all" when filters are active', () => {
      renderPanel({ hasActiveFilters: true });
      expect(
        screen.getByRole("button", { name: /clear all/i }),
      ).toBeInTheDocument();
    });
  });

  describe("active state", () => {
    it('active company chip has "active" class', () => {
      renderPanel({ filters: { ...baseFilters, company: ["Acme"] } });
      expect(screen.getByRole("button", { name: "Acme" })).toHaveClass(
        "active",
      );
    });

    it('inactive company chips do not have "active" class', () => {
      renderPanel({ filters: { ...baseFilters, company: ["Acme"] } });
      expect(screen.getByRole("button", { name: "Beta" })).not.toHaveClass(
        "active",
      );
    });

    it('active location chip has "active" class', () => {
      renderPanel({ filters: { ...baseFilters, location: ["Remote"] } });
      expect(screen.getByRole("button", { name: "Remote" })).toHaveClass(
        "active",
      );
    });

    it("supports multiple active company chips", () => {
      renderPanel({ filters: { ...baseFilters, company: ["Acme", "Beta"] } });
      expect(screen.getByRole("button", { name: "Acme" })).toHaveClass(
        "active",
      );
      expect(screen.getByRole("button", { name: "Beta" })).toHaveClass(
        "active",
      );
    });

    it('active tag chips have "active" class', () => {
      renderPanel({ filters: { ...baseFilters, tags: ["react", "node"] } });
      expect(screen.getByRole("button", { name: "react" })).toHaveClass(
        "active",
      );
      expect(screen.getByRole("button", { name: "node" })).toHaveClass(
        "active",
      );
      expect(
        screen.getByRole("button", { name: "javascript" }),
      ).not.toHaveClass("active");
    });
  });

  describe("interactions", () => {
    it("calls onToggleCompany with the company name when a chip is clicked", async () => {
      const onToggleCompany = vi.fn();
      renderPanel({ onToggleCompany });
      await userEvent.click(screen.getByRole("button", { name: "Acme" }));
      expect(onToggleCompany).toHaveBeenCalledWith("Acme");
    });

    it("calls onToggleLocation with the location name when a chip is clicked", async () => {
      const onToggleLocation = vi.fn();
      renderPanel({ onToggleLocation });
      await userEvent.click(screen.getByRole("button", { name: "Berlin" }));
      expect(onToggleLocation).toHaveBeenCalledWith("Berlin");
    });

    it("calls onToggleTag with the tag name when a chip is clicked", async () => {
      const onToggleTag = vi.fn();
      renderPanel({ onToggleTag });
      await userEvent.click(screen.getByRole("button", { name: "react" }));
      expect(onToggleTag).toHaveBeenCalledWith("react");
    });

    it('calls onClearAll when "Clear all" is clicked', async () => {
      const onClearAll = vi.fn();
      renderPanel({ hasActiveFilters: true, onClearAll });
      await userEvent.click(screen.getByRole("button", { name: /clear all/i }));
      expect(onClearAll).toHaveBeenCalledTimes(1);
    });
  });
});
