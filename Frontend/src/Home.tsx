import React from "react";
import logo from "./logo.png";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <img src={logo} alt="Sportschool De Kast" className="home-logo" />
        <nav className="home-nav">
          <button className="nav-btn">Cursussen</button>
          <button className="nav-btn">Abonnementen</button>
          <button className="nav-btn">Personal Coach</button>
        </nav>
      </header>

      <main>
        <section className="home-actions">
          <div className="action-block">
            <h2>Inschrijven voor cursussen? Dat kan!</h2>
            <button className="action-btn">Schrijf je in!</button>
          </div>
          <div className="action-block">
            <h2>Beheer je abonnementen.</h2>
            <button className="action-btn">Abonnementen</button>
          </div>
        </section>

        <section className="home-info">
          <div className="info-left">
            <p>
              Stap binnen bij De Kast, dé sportschool waar discipline, kracht en
              plezier samenkomen. Of je nu wilt werken aan je conditie,
              spiermassa wilt opbouwen of gewoon fitter door het leven wilt gaan
              – bij ons vind je de ruimte én de begeleiding om je doelen te
              bereiken.
            </p>
            <ul className="checklist">
              <li>
                <span className="checkmark">✅</span> Moderne apparatuur
              </li>
              <li>
                <span className="checkmark">✅</span> Professionele Trainers
              </li>
              <li>
                <span className="checkmark">✅</span> Uitmuntende Cursussen
              </li>
            </ul>
          </div>
          <div className="info-right">
            <p>
              Bij De Kast draait het om doorzetten, grenzen verleggen en sterker
              worden dan ooit. Of je nu net begint of al jaren traint, wij
              bieden jou de perfecte plek om je doelen te smashen.
            </p>
          </div>
        </section>

        <section className="home-coach">
          <h2>Maak een afspraak met een Personal Coach!</h2>
          <p>Onze gediplomeerde Personal Coaches staan klaar om u te helpen!</p>
          <button className="coach-btn">Bekijk aanbod</button>
        </section>
      </main>
    </div>
  );
}
