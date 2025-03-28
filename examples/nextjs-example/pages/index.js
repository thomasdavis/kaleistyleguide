import React from 'react';
import Link from 'next/link';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Home() {
  return (
    <div className="container">
      <header className="section">
        <h1 className="heading-1 text-center">Kalei Design System Example</h1>
        <p className="text-lg text-center mb-4">
          A demonstration of using Kalei Styleguide with Next.js
        </p>
        <div className="text-center mb-5">
          <Link href="/styleguide" passHref>
            <Button variant="primary" size="lg">
              View Style Guide
            </Button>
          </Link>
        </div>
      </header>

      <section className="section-alt">
        <div className="container-narrow">
          <h2 className="heading-2 text-center mb-4">Component Showcase</h2>
          
          <h3 className="heading-3 mb-3">Buttons</h3>
          <div className="mb-4" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" withIcon>
              <span className="button-icon">📁</span>
              <span>With Icon</span>
            </Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>

          <h3 className="heading-3 mb-3">Cards</h3>
          <div className="grid mb-5">
            <Card>
              <Card.Header>Standard Card</Card.Header>
              <Card.Body>
                <p>This is a standard card component with a header, body, and footer.</p>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary">Action</Button>
              </Card.Footer>
            </Card>

            <Card featured>
              <Card.Header primary>Featured Card</Card.Header>
              <Card.Body padded>
                <p>This card is marked as featured for emphasis.</p>
              </Card.Body>
              <Card.Footer centered>
                <Button variant="primary">Action</Button>
              </Card.Footer>
            </Card>

            <Card>
              <Card.Image src="https://picsum.photos/400/200" alt="Sample image" />
              <Card.Body>
                <h3 className="mb-2">Card with Image</h3>
                <p>This card includes an image at the top.</p>
              </Card.Body>
              <Card.Footer>
                <Button variant="outline">View Details</Button>
              </Card.Footer>
            </Card>
          </div>

          <h3 className="heading-3 mb-3">Horizontal Card</h3>
          <Card horizontal className="mb-5">
            <Card.Media backgroundImage="https://picsum.photos/400/400" />
            <Card.Content>
              <Card.Header>Horizontal Card</Card.Header>
              <Card.Body>
                <p>This card uses a horizontal layout with an image on the left and content on the right.</p>
                <p>It's useful for media-rich content where the image is an important part of the presentation.</p>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary">Primary Action</Button>
                <Button variant="outline" style={{ marginLeft: '0.5rem' }}>Secondary</Button>
              </Card.Footer>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <h2 className="heading-2 text-center mb-4">About This Example</h2>
          <p className="text-lg mb-3">
            This Next.js application demonstrates how to integrate Kalei Styleguide with a modern web application. 
            The styles are documented with markdown comments in CSS files, which Kalei can parse to generate a 
            living style guide.
          </p>
          <p className="mb-4">
            The style guide can be run in two ways:
          </p>
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="mb-2">1. Standalone Mode</h3>
              <p>Run Kalei as a separate application that analyzes your CSS files.</p>
              <pre className="mb-3" style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
                npm run styleguide
              </pre>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="mb-2">2. Embedded Mode</h3>
              <p>Access Kalei as a route within your Next.js application.</p>
              <pre className="mb-3" style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
                http://localhost:3000/styleguide
              </pre>
            </div>
          </div>
        </div>
      </section>

      <footer className="section" style={{ background: '#333', color: 'white' }}>
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} Kalei Styleguide Example</p>
          <p className="mb-0">
            <a href="https://github.com/your-username/kaleistyleguide" style={{ color: 'white', textDecoration: 'underline' }}>
              GitHub Repository
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}