import Navbar from 'components/Navbar';
import type { Route } from "./+types/home";
import { ArrowRight, ArrowUpRight, ClockIcon, Layers } from 'lucide-react';
import Button from 'components/ui/Button';
import Upload from 'components/Upload';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { createProject } from 'lib/puter.actions';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomify" },
    { name: "description", content: "AI Powered application designed to convert architectal designs into 3D images." },
  ];
}

export default function Home() {

  const [projects, setProjects] = useState<DesignItem[]>([])

  const navigate = useNavigate()

  const handleUploadComplete = async (base64Image: string) => {
    const newId = Date.now().toString()
    const name = `Residence ${newId}`

    const newItem = {
      id: newId,
      name,
      sourceImage: base64Image,
      timestamp: Date.now()
    }

    const saved = await createProject({ item: newItem, visibility: 'private' })

    if(!saved) {
      console.error('Failed to create project')
      return false
    }

    setProjects((prev) => [saved, ...prev])

    navigate(`/visualizer/${newId}`, {
      state: {
        initialImage: saved.sourceImage,
        initialRendered: saved.renderedImage || null,
        name
      }
    })

    return true
  }

  return (
    <div className='home'>
      <Navbar />

      <section className='hero'>
        <div className='announce'>
          <div className='dot'>
            <div className='pulse'/>
          </div>

          <p>Introducing Roomify 2.0</p>
        </div>

        <h1>Built bautiful spaces at the spped of thought with Roomify</h1>

        <p className='subtitle'>
          Roomify is an AI-first design environment that helps you visualize, render, and ship
          architectural projects faster than ever
        </p>

        <div className='actions'>
          <a href='#upload' className='cta'>
            Start Building <ArrowRight className='icon'/>
          </a>

          <Button variant='outline' size='lg' className='demo'>
            Watch Demo
          </Button>
        </div>

        <div id='upload' className='upload-shell'>
          <div className='grid-overlay'/>

          <div className='upload-card'>
            <div className='upload-head'>
              <div className='upload-icon'>
                <Layers  className='icon'/>
              </div>

              <h3>Upload your floor plan</h3>
              <p>Supports JPG, PNG, formats up to 10 MB</p>
            </div>

            <Upload
              onComplete={handleUploadComplete}
            />
          </div>
        </div>
      </section>

      <section className='projects'>
        <div className='section-inner'>
          <div className='section-head'>
            <div className='copy'>
              <h2>Projects</h2>
              <p>Your latest work and shared community projects, all in one place.</p>
            </div>
          </div>

          <div className='projects-grid'>
            {projects.map(({ id, name, renderedImage, sourceImage, timestamp }) => (
              <div className='project-card group' id={id}>
                <div className='preview'>
                  <img src={renderedImage || sourceImage} alt='Porject preview'/>

                  <div className='badge'>
                    <span>Community</span>
                  </div>
                </div>

                <div className='card-body'>
                  <div>
                    <h3>{name}</h3>

                    <div className='meta'>
                      <ClockIcon size={12}/>
                      <span>{new Date(timestamp).toLocaleDateString()}</span>
                      <span>By SM</span>
                    </div>
                  </div>

                  <div className='arrow'>
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
