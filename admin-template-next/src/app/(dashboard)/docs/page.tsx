import React from "react";

export default function DocsPage() {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="fs-3 mb-1 text-dark">Documentation</h1>
              <p className="text-secondary">
                This documentation will guide you through the setup and usage of the InApp Inventory Dashboard template.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4 text-dark">
              {/* Prerequisites */}
              <div className="mb-4">
                <h2 className="h5 mb-2 fw-bold">Prerequisites</h2>
                <p className="text-secondary">Before you begin, ensure you have the following installed:</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item ps-0 text-secondary border-0">Node.js (v14 or higher)</li>
                  <li className="list-group-item ps-0 text-secondary border-0">npm or yarn package manager</li>
                  <li className="list-group-item ps-0 text-secondary border-0">Any other specific tools/dependencies</li>
                </ul>
              </div>

              {/* Installation */}
              <div className="mb-4 border-top pt-4">
                <h2 className="h5 mb-2 fw-bold">Installation</h2>
                <ol className="list-group list-group-numbered list-group-flush">
                  <li className="list-group-item ps-0 text-secondary border-0">
                    Clone the repository or download the template
                  </li>
                  <li className="list-group-item ps-0 text-secondary border-0">
                    Navigate to the project directory
                  </li>
                  <li className="list-group-item ps-0 text-secondary border-0">
                    Install dependencies:
                    <pre className="bg-light border rounded p-3 mt-2">
                      <code>npm install</code>
                    </pre>
                  </li>
                </ol>
              </div>

              {/* Usage */}
              <div className="mb-4 border-top pt-4">
                <h2 className="h5 mb-2 fw-bold">Run the app</h2>
                <p className="text-secondary">To start the development server:</p>
                <pre className="bg-light border rounded p-3">
                  <code>npm run dev</code>
                </pre>
              </div>

              {/* Next Steps */}
              <div className="mb-4 border-top pt-4">
                <h2 className="h5 mb-2 fw-bold">Next Steps</h2>
                <ol className="list-group list-group-numbered list-group-flush">
                  <li className="list-group-item ps-0 text-secondary border-0">
                    Review the main entry point in <code>src/js/main.js</code>
                  </li>
                  <li className="list-group-item ps-0 text-secondary border-0">
                    Customize components according to your needs
                  </li>
                  <li className="list-group-item ps-0 text-secondary border-0">
                    Build for production:
                    <pre className="bg-light border rounded p-3 mt-2">
                      <code>npm run build</code>
                    </pre>
                  </li>
                </ol>
              </div>

              {/* Project Structure */}
              <div className="mb-4 border-top pt-4">
                <h2 className="h5 mb-2 fw-bold">Project Structure</h2>
                <pre className="bg-light border rounded p-3">
                  <code>{`inapp/
├── src/
│   ├── assets/         # Static assets
│   │   ├── images/     # Images
│   │   ├── js/         # JS
│   │   ├── scss/       # CSS and styling
│   └── Pages           # All Pages
├── vite.config.js/     # Config Files
├── package.json        # Project dependencies
├── README.md           # Documentation
└── .gitignore          # Git ignore file`}</code>
                </pre>
              </div>

              {/* Support */}
              <div className="mb-2 border-top pt-4">
                <h2 className="h5 fw-bold">Support</h2>
                <p className="text-secondary">
                  For issues or questions, please refer to the documentation or create an issue in the repository.
                  Also you can contact us at{" "}
                  <a href="#!" className="text-primary text-decoration-none">
                    CodesCandy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <footer className="text-center py-2 mt-6 text-secondary">
            <p className="mb-0">
              Copyright © 2026 InApp Inventory Dashboard. Developed by{" "}
              <a href="https://codescandy.com/" target="_blank" className="text-primary text-decoration-none">
                CodesCandy
              </a>{" "}
              • Distributed by{" "}
              <a href="https://themewagon.com/" target="_blank" className="text-primary text-decoration-none">
                ThemeWagon
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
