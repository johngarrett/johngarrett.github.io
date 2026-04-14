import type { Renderable } from "../utils";

// TODO: styles.css and read from it

export const StyleSheet: () => Renderable = () => {
  return {
    path: "styles.css",
    render: () => `
            :root {
            --bg-color: #f9f9f9;
            --text-main: #222;
            --text-muted: #777;
            --accent-color: #2c3e50; /* Dark Slate Blue */
            --accent-hover: #1a252f;
            --card-bg: #fff;
            --border-color: #eaeaea;
        }

            body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
        }

            h1 {
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
            color: var(--accent-color);
        }
    `,
  };
};
