import React, { useState, useEffect } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { Mission } from '../types/mission.types';

const AddMissionFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [missionData, setMissionData] = useState<Partial<Mission>>({
    status: 'draft'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPurposeHelp, setShowPurposeHelp] = useState(false);
  const [purposeHelpText, setPurposeHelpText] = useState('');
  const [urlFields, setUrlFields] = useState(['']);
  const [fileUploads, setFileUploads] = useState<File[]>([]);

  const { saveMission } = useIndexedDB();

  const handleCoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const coreData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      intent_summary: formData.get('intent_summary') as string,
      category: {
        id: parseInt(formData.get('category') as string),
        name: formData.get('category') === '1' ? 'Writing' : 'Coding & Programming'
      },
      domain: formData.get('category') === '1' ? 'writing' : 'coding_programming'
    };
    
    setMissionData(prev => ({ ...prev, ...coreData }));
    setCurrentStep(2);
  };

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    let domainData: any = {};
    
    if (missionData.domain === 'writing') {
      domainData = {
        subcategory: {
          id: formData.get('subcategory'),
          name: Array.from(e.target.querySelectorAll('option:checked'))[0]?.text
        },
        intent_schema: {
          purpose: formData.get('purpose') as string,
          target_audience: formData.get('target_audience') as string,
          language: formData.get('language') as string
        },
        preference_schema: {
          tone: formData.get('tone') as string,
          approx_length: formData.get('approx_length') as string
        },
        context_schema: {
          references: urlFields.filter(url => url.trim() !== ''),
          style_reference: formData.get('style_reference') as string,
          existing_assets: fileUploads,
          notes: formData.get('notes') as string
        }
      };
    } else {
      domainData = {
        subcategory: {
          id: formData.get('subcategory'),
          name: Array.from(e.target.querySelectorAll('option:checked'))[0]?.text
        },
        intent_schema: {
          purpose: formData.get('purpose') as string,
          target_users: formData.get('target_users') as string,
          complexity: formData.get('complexity') as string
        },
        technical_direction_schema: {
          environment: formData.get('environment') as string,
          preferred_stack: formData.get('preferred_stack') as string
        },
        constraint_schema: {
          timeline: formData.get('timeline') as string,
          quality_focus: formData.get('quality_focus') as string
        },
        context_schema: {
          references: urlFields.filter(url => url.trim() !== ''),
          dependencies: formData.get('dependencies') as string,
          existing_codebase: fileUploads,
          notes: formData.get('notes') as string
        }
      };
    }

    setMissionData(prev => ({ ...prev, ...domainData }));
    // Simpan ke IndexedDB sebelum lanjut ke tahap 3
    saveMission({ ...prev, ...domainData } as Mission);
    setCurrentStep(3);
  };

  const handlePurposeHelp = (purpose: string) => {
    const helpTexts: Record<string, string> = {
      // Writing purposes
      'Educate': 'Untuk tulisan yang ditujukan untuk memberikan pengetahuan atau informasi kepada pembaca',
      'Inform': 'Untuk tulisan yang bertujuan memberikan informasi factual kepada pembaca',
      'Entertain': 'Untuk tulisan yang ditujukan untuk menghibur pembaca',
      'Persuade': 'Untuk tulisan yang bertujuan meyakinkan atau membujuk pembaca',
      'Document': 'Untuk tulisan yang berfungsi sebagai dokumentasi atau catatan',
      // Coding purposes
      'Build': 'Adalah proyek yang ditujukan untuk membuat aplikasi atau sistem dari awal',
      'Refactor': 'Proyek untuk merestruktur kode yang sudah ada menjadi lebih baik',
      'Optimize': 'Proyek untuk meningkatkan performa aplikasi atau sistem',
      'Debug': 'Proyek untuk memperbaiki bug atau masalah dalam kode',
      'Integrate': 'Proyek untuk mengintegrasikan sistem atau modul yang berbeda'
    };
    
    setPurposeHelpText(helpTexts[purpose] || '');
    setShowPurposeHelp(true);
  };

  const addUrlField = () => {
    setUrlFields([...urlFields, '']);
  };

  const updateUrlField = (index: number, value: string) => {
    const newUrls = [...urlFields];
    newUrls[index] = value;
    setUrlFields(newUrls);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFileUploads([...fileUploads, ...files]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="modal-content">
            <h2>Buat Misi Baru</h2>
            <form onSubmit={handleCoreSubmit}>
              <div className="form-group">
                <label>Nama Misi *</label>
                <input type="text" name="name" required />
              </div>
              
              <div className="form-group">
                <label>Deskripsi *</label>
                <textarea name="description" required />
              </div>
              
              <div className="form-group">
                <label>Ringkasan Maksud *</label>
                <textarea name="intent_summary" required />
              </div>
              
              <div className="form-group">
                <label>Kategori Misi *</label>
                <select name="category" required>
                  <option value="">Pilih kategori</option>
                  <option value="1">Writing</option>
                  <option value="2">Coding & Programming</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">Lanjut</button>
              </div>
            </form>
          </div>
        );
      
      case 2:
        return (
          <div className="modal-content">
            <h2>Detail Misi</h2>
            <form onSubmit={handleDomainSubmit}>
              <div className="form-group">
                <label>SubKategori *</label>
                <select name="subcategory" required>
                  <option value="">Pilih subkategori</option>
                  {missionData.domain === 'writing' ? (
                    <>
                      <option value="1.1">Artikel</option>
                      <option value="1.2">Buku</option>
                      <option value="1.3">Novel</option>
                      <option value="1.4">Cerpen</option>
                      <option value="1.5">Copywriting Pemasaran</option>
                      <option value="1.6">Script Video</option>
                      <option value="1.7">Script Podcast</option>
                      <option value="1.8">Esai Akademik</option>
                      <option value="1.9">Makalah</option>
                      <option value="1.10">Skripsi</option>
                      <option value="1.11">Thesis</option>
                      <option value="1.12">AI-Content Creation</option>
                    </>
                  ) : (
                    <>
                      <option value="2.1">Web Development</option>
                      <option value="2.2">Web App / Tools</option>
                      <option value="2.3">Aplikasi Mobile</option>
                      <option value="2.4">Landing Page / Web Statis</option>
                      <option value="2.5">AI Agent Development</option>
                      <option value="2.6">Green & Secure Software</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Tujuan {missionData.domain === 'writing' ? 'Tulisan' : 'Proyek'} *</label>
                <select name="purpose" required>
                  <option value="">Pilih tujuan</option>
                  {missionData.domain === 'writing' ? (
                    <>
                      <option value="Educate">Educate</option>
                      <option value="Inform">Inform</option>
                      <option value="Entertain">Entertain</option>
                      <option value="Persuade">Persuade</option>
                      <option value="Document">Document</option>
                    </>
                  ) : (
                    <>
                      <option value="Build">Build</option>
                      <option value="Refactor">Refactor</option>
                      <option value="Optimize">Optimize</option>
                      <option value="Debug">Debug</option>
                      <option value="Integrate">Integrate</option>
                    </>
                  )}
                </select>
                <button 
                  type="button" 
                  className="help-toggle"
                  onClick={() => handlePurposeHelp((document.querySelector('select[name="purpose"]') as HTMLSelectElement)?.value)}
                >
                  Bingung harus pilih apa? Pelajari ⇒
                </button>
              </div>

              <div className="form-group">
                <label>Target {missionData.domain === 'writing' ? 'Audience' : 'Pengguna'} *</label>
                <input 
                  type="text" 
                  name={missionData.domain === 'writing' ? 'target_audience' : 'target_users'} 
                  placeholder="Contoh: Pembaca umum, Pengguna aplikasi"
                />
              </div>

              {missionData.domain === 'writing' ? (
                <>
                  <div className="form-group">
                    <label>Bahasa *</label>
                    <select name="language" required>
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">Bahasa Inggris</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Gaya Bahasa *</label>
                    <select name="tone" required>
                      <option value="">Pilih gaya</option>
                      <option value="Formal">Formal</option>
                      <option value="Casual">Casual</option>
                      <option value="Technical">Technical</option>
                      <option value="Storytelling">Storytelling</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Kategori Tulisan *</label>
                    <select name="approx_length" required>
                      <option value="">Pilih kategori</option>
                      <option value="Short">Short</option>
                      <option value="Medium">Medium</option>
                      <option value="Long">Long</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Kerumitan *</label>
                    <select name="complexity" required>
                      <option value="">Pilih kerumitan</option>
                      <option value="Simple">Simple</option>
                      <option value="Medium">Medium</option>
                      <option value="Complex">Complex</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Ruang Lingkup *</label>
                    <select name="environment" required>
                      <option value="">Pilih lingkup</option>
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Backend">Backend</option>
                      <option value="CLI">CLI</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Teknologi yang Dipakai *</label>
                    <select name="preferred_stack" required>
                      <option value="">Pilih teknologi</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estimasi Pengerjaan *</label>
                    <select name="timeline" required>
                      <option value="">Pilih estimasi</option>
                      <option value="1-2 days">1-2 days</option>
                      <option value="1 week">1 week</option>
                      <option value="2-4 weeks">2-4 weeks</option>
                      <option value="1-3 months">1-3 months</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Fokus *</label>
                    <select name="quality_focus" required>
                      <option value="">Pilih fokus</option>
                      <option value="Performance">Performance</option>
                      <option value="Security">Security</option>
                      <option value="Maintainability">Maintainability</option>
                    </select>
                  </div>
                </>
              )}

              <h3>Kolom Referensi dan Amunisi</h3>
              
              <div className="form-group">
                <label>Referensi URL</label>
                {urlFields.map((url, index) => (
                  <div key={index} className="url-input-group">
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => updateUrlField(index, e.target.value)}
                    />
                    {index === urlFields.length - 1 && (
                      <button type="button" onClick={addUrlField}>+</button>
                    )}
                  </div>
                ))}
              </div>

              {missionData.domain === 'writing' ? (
                <div className="form-group">
                  <label>Referensi Gaya</label>
                  <input type="text" name="style_reference" />
                </div>
              ) : (
                <div className="form-group">
                  <label>Dependensi</label>
                  <input type="text" name="dependencies" />
                </div>
              )}

              <div className="form-group">
                <label>Bahan / {missionData.domain === 'writing' ? 'Materi Konteks' : 'Basis Kode yang Ada'}</label>
                <input type="file" multiple onChange={handleFileUpload} />
              </div>

              <div className="form-group">
                <label>Catatan</label>
                <textarea name="notes" />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary">
                  Kembali
                </button>
                <button type="submit" className="btn-primary">Lanjut</button>
              </div>
            </form>
          </div>
        );
      
      case 3:
        return (
          <div className="modal-content">
            <h2>Menyiapkan Misi dan Tim AI</h2>
            <div className="loading-state">
              <div className="spinner">🔄</div>
              <p>menyiapkan misi dan tim agen AI rekomendasi...</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="add-mission-modal">
      {renderStep()}
      
      {showPurposeHelp && (
        <div className="help-modal" onClick={() => setShowPurposeHelp(false)}>
          <div className="help-content" onClick={(e) => e.stopPropagation()}>
            <h4>Penjelasan:</h4>
            <p>{purposeHelpText}</p>
            <button onClick={() => setShowPurposeHelp(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMissionFlow;