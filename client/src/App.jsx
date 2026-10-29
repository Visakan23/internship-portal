
import { useState } from "react";
import { Link, Route, Routes, useParams, useNavigate } from "react-router-dom";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const internships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "TechNova",
    location: "Remote",
    duration: "3 months",
    stipend: "₹8,000/month",
    description:
      "Learn React, JavaScript, responsive design, and frontend development by building practical projects.",
  },
  {
    id: "2",
    title: "Java Developer Intern",
    company: "CodeWorks",
    location: "Coimbatore",
    duration: "2 months",
    stipend: "₹6,000/month",
    description:
      "Practice Java, object-oriented programming, REST APIs, and database integration.",
  },
  {
    id: "3",
    title: "Data Analyst Intern",
    company: "DataSphere",
    location: "Hybrid",
    duration: "3 months",
    stipend: "₹10,000/month",
    description:
      "Work with datasets, SQL, Python, data cleaning, and dashboard development.",
  },
];

function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">InternConnect</Link>
      <nav>
        <Link to="/">Internships</Link>
        <a href="#about">About</a>
      </nav>
    </header>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <span className="eyebrow">YOUR CAREER STARTS HERE</span>
        <h1>Find an internship.<br />Build your future.</h1>
        <p>Explore opportunities, develop real-world skills, and take the next step in your career.</p>
        <a className="primary-button" href="#internships">Explore internships</a>
      </section>

      <main id="internships" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">OPPORTUNITIES</span>
            <h2>Featured internships</h2>
          </div>
          <span className="count">{internships.length} opportunities</span>
        </div>

        <div className="internship-grid">
          {internships.map((item) => (
            <article className="internship-card" key={item.id}>
              <div className="card-top">
                <div className="company-icon">{item.company.charAt(0)}</div>
                <span className="tag">{item.location}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="company-name">{item.company}</p>
              <p className="description">{item.description}</p>
              <div className="card-meta">
                <span>◷ {item.duration}</span>
                <span>{item.stipend}</span>
              </div>
              <Link className="card-link" to={`/internship/${item.id}`}>
                View details <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </main>

      <section className="about-section" id="about">
        <span className="eyebrow">ABOUT INTERNCONNECT</span>
        <h2>Learn by doing.</h2>
        <p>Discover internship opportunities and apply directly through our student portal.</p>
      </section>
    </>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const internship = internships.find((item) => item.id === id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
  });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!internship) {
    return (
      <main className="section">
        <h2>Internship not found</h2>
        <Link to="/">Back to internships</Link>
      </main>
    );
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");

    if (!form.name.trim() || !form.email.trim() || !form.rollNumber.trim()) {
      setStatus("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          internshipId: internship.id,
          internshipTitle: internship.title,
          company: internship.company,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      setStatus("Application submitted successfully!");
      setForm({ name: "", email: "", rollNumber: "" });
    } catch (error) {
      console.error("Application request failed:", error);
      setStatus(
        `Could not submit application: ${error.message}. Check that the backend is running and the API URL is correct (${API_URL}).`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section details-layout">
      <div className="details-content">
        <button className="back-button" onClick={() => navigate("/")}>
          ← All internships
        </button>
        <span className="eyebrow">INTERNSHIP DETAILS</span>
        <h1>{internship.title}</h1>
        <p className="company-name">{internship.company}</p>

        <div className="detail-pills">
          <span>{internship.location}</span>
          <span>{internship.duration}</span>
          <span>{internship.stipend}</span>
        </div>

        <h2>About this opportunity</h2>
        <p className="description">{internship.description}</p>
        <h2>What you'll gain</h2>
        <ul className="benefit-list">
          <li>Practical project experience</li>
          <li>Industry-relevant technical skills</li>
          <li>Experience to strengthen your resume</li>
        </ul>
      </div>

      <aside className="form-card">
        <span className="eyebrow">TAKE THE NEXT STEP</span>
        <h2>Apply now</h2>
        <p>Enter your details to submit your application.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="rollNumber">Roll number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            value={form.rollNumber}
            onChange={handleChange}
            placeholder="Enter your roll number"
            required
          />

          <div className="selected-internship">
            <span>Applying for</span>
            <strong>{internship.title}</strong>
            <small>{internship.company}</small>
          </div>

          <button className="primary-button submit-button" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit application"}
          </button>

          {status && (
            <p className={`status-message ${status.startsWith("Application submitted") ? "success" : "error"}`} role="status">
              {status}
            </p>
          )}
        </form>
      </aside>
    </main>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/internship/:id" element={<InternshipDetails />} />
      </Routes>
      <footer className="footer">
        <span>InternConnect</span>
        <span>Connecting students with opportunities.</span>
      </footer>
    </div>
  );
}
