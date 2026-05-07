"use client";

import { useEffect } from "react";
import {
  CONTACT_LINKS,
  estimateMarkdownTokens,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../lib/agent-discovery";

type PortfolioMode = "human" | "agent";

type ToolResult = {
  content: Array<{
    type: "text";
    text: string;
  }>;
  [key: string]: unknown;
};

type ModelContextTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (
    input: Record<string, unknown>
  ) => Promise<ToolResult> | ToolResult;
};

type ModelContextRegistration = {
  unregister?: () => void;
};

type ModelContext = {
  provideContext?: (context: { tools: ModelContextTool[] }) => void;
  clearContext?: () => void;
  registerTool?: (
    tool: ModelContextTool
  ) => void | ModelContextRegistration;
  unregisterTool?: (name: string) => void;
};

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}

type WebMCPToolsProps = {
  markdownContent: string;
  onModeChange: (mode: PortfolioMode) => void;
};

const emptyInputSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export function WebMCPTools({
  markdownContent,
  onModeChange,
}: WebMCPToolsProps) {
  useEffect(() => {
    const modelContext = navigator.modelContext;

    if (!modelContext) {
      return;
    }

    const tools: ModelContextTool[] = [
      {
        name: "get_portfolio_markdown",
        title: "Get Portfolio Markdown",
        description:
          "Return Anant Gabhane's portfolio as markdown for agent-readable profile research.",
        inputSchema: emptyInputSchema,
        annotations: {
          readOnlyHint: true,
        },
        execute: async () => ({
          markdown: markdownContent,
          tokenEstimate: estimateMarkdownTokens(markdownContent),
          content: [
            {
              type: "text",
              text: markdownContent,
            },
          ],
        }),
      },
      {
        name: "get_contact_links",
        title: "Get Contact Links",
        description:
          "Return Anant Gabhane's public contact links and profile resources.",
        inputSchema: emptyInputSchema,
        annotations: {
          readOnlyHint: true,
        },
        execute: async () => {
          const payload = {
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            contact: CONTACT_LINKS,
          };

          return {
            ...payload,
            content: [
              {
                type: "text",
                text: JSON.stringify(payload, null, 2),
              },
            ],
          };
        },
      },
      {
        name: "set_portfolio_mode",
        title: "Set Portfolio Mode",
        description:
          "Switch the visible portfolio between the human visual page and the agent markdown view.",
        inputSchema: {
          type: "object",
          properties: {
            mode: {
              type: "string",
              enum: ["human", "agent"],
              description: "The portfolio view mode to show.",
            },
          },
          required: ["mode"],
          additionalProperties: false,
        },
        execute: async (input) => {
          const mode: PortfolioMode = input.mode === "agent" ? "agent" : "human";
          onModeChange(mode);

          return {
            mode,
            content: [
              {
                type: "text",
                text: `Portfolio mode set to ${mode}.`,
              },
            ],
          };
        },
      },
    ];

    try {
      if (typeof modelContext.provideContext === "function") {
        navigator.modelContext?.provideContext?.({ tools });

        return () => {
          try {
            navigator.modelContext?.clearContext?.();
          } catch (error) {
            console.warn("WebMCP context cleanup failed", error);
          }
        };
      }

      if (typeof modelContext.registerTool === "function") {
        const cleanup: Array<() => void> = [];

        tools.forEach((tool) => {
          try {
            modelContext.unregisterTool?.(tool.name);
          } catch {
            // Some WebMCP implementations throw when the tool is not present.
          }

          const registration = modelContext.registerTool?.(tool);

          if (
            registration &&
            typeof registration === "object" &&
            typeof registration.unregister === "function"
          ) {
            cleanup.push(() => registration.unregister?.());
          } else if (typeof modelContext.unregisterTool === "function") {
            cleanup.push(() => modelContext.unregisterTool?.(tool.name));
          }
        });

        return () => {
          cleanup.forEach((unregister) => {
            try {
              unregister();
            } catch (error) {
              console.warn("WebMCP tool cleanup failed", error);
            }
          });
        };
      }
    } catch (error) {
      console.warn("WebMCP tool registration failed", error);
    }
  }, [markdownContent, onModeChange]);

  return null;
}
