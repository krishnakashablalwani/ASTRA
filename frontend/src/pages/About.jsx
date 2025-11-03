import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function About() {
  const { theme } = useTheme();

  const creators = [
    {
      name: "Krishna Kashabalwani",
      role: "Lead Developer & Creator",
      email: "krishnakashab@gmail.com",
      description:
        "Full-stack developer passionate about creating innovative campus solutions",
      skills: ["React", "Node.js", "MongoDB", "AI Integration"],
      github: "https://github.com/krishnakashablalwani",
    },
  ];

  const features = [
    {
      icon: "bi-people",
      title: "Club Management",
      desc: "Create and join clubs with AI-powered tag suggestions",
    },
    {
      icon: "bi-calendar-event",
      title: "Event Planning",
      desc: "RSVP to events and stay updated on campus activities",
    },
    {
      icon: "bi-list-task",
      title: "Smart Tasks",
      desc: "AI-powered task prioritization with urgency tracking",
    },
    {
      icon: "bi-camera",
      title: "StudySnap",
      desc: "Share what you're studying with the campus community",
    },
    {
      icon: "bi-book",
      title: "Library Access",
      desc: "Browse and manage library resources",
    },
    {
      icon: "bi-stopwatch",
      title: "Study Timer",
      desc: "Track focused study sessions with Pomodoro technique",
    },
    {
      icon: "bi-graph-up",
      title: "Subject Proficiency",
      desc: "Monitor your progress across different subjects",
    },
    {
      icon: "bi-clipboard-check",
      title: "Attendance",
      desc: "Track your attendance records",
    },
    {
      icon: "bi-wallet2",
      title: "Fee Tracker",
      desc: "Manage and monitor fee payments",
    },
    {
      icon: "bi-search",
      title: "Lost & Found",
      desc: "Report and find lost items on campus",
    },
    {
      icon: "bi-file-earmark-text",
      title: "PYQ Papers",
      desc: "Access previous year question papers",
    },
    {
      icon: "bi-chat-dots",
      title: "AI Chatbot",
      desc: "Get instant help with campus queries",
    },
  ];

  const techStack = [
    {
      category: "Frontend",
      items: ["React 18.2", "Vite 5.1", "Bootstrap 5", "React Router"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "MongoDB", "Mongoose"],
    },
    {
      category: "AI/ML",
      items: ["SambaNova Llama", "Natural Language Processing"],
    },
    {
      category: "Features",
      items: ["JWT Authentication", "File Upload (Multer)", "Dark/Light Theme"],
    },
  ];

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="text-center mb-5">
        <img
          src={theme === "light" ? "/light.png" : "/dark.png"}
          alt="CampusHive Logo"
          style={{ height: 100 }}
          className="mb-3"
        />
        <h1 className="display-4 fw-bold mb-2 text-warning">CampusHive</h1>
        <p className="lead text-muted">Your Unified Hub for Campus Life</p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <span className="badge bg-primary px-3 py-2">v1.0.0</span>
          <span className="badge bg-success px-3 py-2">26+ Features</span>
          <span className="badge bg-info px-3 py-2">AI-Powered</span>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: 16 }}>
            <div className="card-body p-5">
              <h3 className="text-center mb-4">Our Mission</h3>
              <p className="lead text-center">
                CampusHive is designed to streamline and enhance the campus
                experience by bringing together all essential student
                activities, club management, events, academic tracking, and
                AI-powered assistance into one unified platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Creators */}
      <div className="mb-5">
        <h2 className="text-center mb-4">Meet the Creator</h2>
        <div className="row justify-content-center">
          {creators.map((creator, idx) => (
            <div className="col-md-6 col-lg-4" key={idx}>
              <div
                className="card shadow-sm border-0 h-100"
                style={{ borderRadius: 16 }}
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 mx-auto d-flex align-items-center justify-content-center"
                      style={{ width: 100, height: 100 }}
                    ></div>
                  </div>
                  <h4 className="mb-1">{creator.name}</h4>
                  <p className="text-primary mb-2">{creator.role}</p>
                  <p className="text-muted small mb-3">{creator.description}</p>

                  <div className="mb-3">
                    <small className="text-muted d-block mb-2">Skills</small>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      {creator.skills.map((skill, i) => (
                        <span key={i} className="badge bg-secondary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-center">
                    <a
                      href={`mailto:${creator.email}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                        Email
                    </a>
                    {creator.github && (
                      <a
                        href={creator.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-dark"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-5">
        <h2 className="text-center mb-4">
          Key Features
        </h2>
        <div className="row g-3">
          {features.map((feature, idx) => (
            <div className="col-md-6 col-lg-4 col-xl-3" key={idx}>
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 12 }}
              >
                <div className="card-body p-3">
                  <div className="d-flex align-items-start">
                    <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                    </div>
                    <div>
                      <h6 className="mb-1">{feature.title}</h6>
                      <small className="text-muted">{feature.desc}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-5">
        <h2 className="text-center mb-4">
          Technology Stack
        </h2>
        <div className="row g-4">
          {techStack.map((stack, idx) => (
            <div className="col-md-6 col-lg-3" key={idx}>
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: 12 }}
              >
                <div className="card-body">
                  <h5 className="text-primary mb-3">
                    {stack.category}
                  </h5>
                  <ul className="list-unstyled mb-0">
                    {stack.items.map((item, i) => (
                      <li key={i} className="mb-2">
                        <small>{item}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm text-center"
            style={{ borderRadius: 12 }}
          >
            <div className="card-body py-4">
              <h2 className="mb-0">10,000+</h2>
              <small className="text-muted">Lines of Code</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm text-center"
            style={{ borderRadius: 12 }}
          >
            <div className="card-body py-4">
              <h2 className="mb-0">26+</h2>
              <small className="text-muted">Features</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm text-center"
            style={{ borderRadius: 12 }}
          >
            <div className="card-body py-4">
              <h2 className="mb-0">2</h2>
              <small className="text-muted">Themes</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm text-center"
            style={{ borderRadius: 12 }}
          >
            <div className="card-body py-4">
              <h2 className="mb-0">AI</h2>
              <small className="text-muted">Powered</small>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-4">
            <h5 className="mb-3">Thank You for Using CampusHive!</h5>
            <p className="text-muted mb-0">
              Built with ❤️ for students, by students
            </p>
            <p className="text-muted small mt-2">
              © 2025 CampusHive. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
