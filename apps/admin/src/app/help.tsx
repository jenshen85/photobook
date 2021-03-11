import React from "react";

export function Help() {
  return (
    <>
      <details open>
        <summary>Add UI library</summary>
        <pre>{`# Generate UI lib
            nx g @nrwl/react:lib ui

            # Add a component
            nx g @nrwl/react:component xyz --project ui`}</pre>
      </details>
      <details>
        <summary>View dependency graph</summary>
        <pre>{`nx dep-graph`}</pre>
      </details>
      <details>
        <summary>Run affected commands</summary>
        <pre>
          {`# see what's been affected by changes
            nx affected:dep-graph

            # run tests for current changes
            nx affected:test

            # run e2e tests for current changes
            nx affected:e2e
          `}
        </pre>
      </details>
    </>
  )
}