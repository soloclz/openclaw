import { describe, expect, it, vi } from "vitest";
import { validateConfigObjectWithPlugins } from "./validation.js";

vi.unmock("../version.js");

describe("comfy provider config validation", () => {
  it("accepts bundled comfy provider config on models.providers path", () => {
    const res = validateConfigObjectWithPlugins({
      models: {
        providers: {
          comfy: {
            mode: "local",
            baseUrl: "http://127.0.0.1:8188",
            allowPrivateNetwork: true,
            music: {
              workflowPath: "./workflows/music-api.json",
              promptNodeId: "94",
              promptInputName: "tags",
              outputNodeId: "107",
            },
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("rejects invalid bundled comfy provider keys on models.providers path", () => {
    const res = validateConfigObjectWithPlugins({
      models: {
        providers: {
          comfy: {
            mode: "local",
            notARealKey: true,
          },
        },
      },
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "models.providers.comfy",
            message: expect.stringContaining("invalid config:"),
          }),
        ]),
      );
    }
  });
});
