import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Home } from '@/pages/Home';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { AssessmentLobby } from '@/pages/AssessmentLobby';
import { SchoolSelectionWizard } from '@/pages/SchoolSelectionWizard';
import { ParentDashboard } from '@/pages/ParentDashboard';
import { TeacherDashboard } from '@/pages/TeacherDashboard';
import { SituationalJudgementAssessment } from '@/pages/assessments/SituationalJudgementAssessment';
import { InterestInventoryAssessment } from '@/pages/assessments/InterestInventoryAssessment';
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NumericalReasoningScene } from '@/games/scenes/NumericalReasoningScene';
import { VerbalReasoningScene } from '@/games/scenes/VerbalReasoningScene';
import { AbstractReasoningScene } from '@/games/scenes/AbstractReasoningScene';
import { MechanicalReasoningScene } from '@/games/scenes/MechanicalReasoningScene';
import { SpatialAbilityScene } from '@/games/scenes/SpatialAbilityScene';
import { CreativeThinkingScene } from '@/games/scenes/CreativeThinkingScene';
import { GameWrapper } from '@/components/game/GameWrapper';
import { gameConfig } from '@/games/config';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Student Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                        <Route path="/dashboard" element={<StudentDashboard />} />
                        <Route path="/assessment" element={<AssessmentLobby />} />
                        <Route path="/assessment/game/numerical" element={
                            <div className="h-[calc(100vh-4rem)] bg-slate-900">
                                <GameWrapper
                                    config={{ ...gameConfig, scene: NumericalReasoningScene }}
                                    domainCode="NUM_REAS"
                                />
                            </div>
                        } />
                        <Route path="/assessment/game/verbal" element={
                            <div className="h-[calc(100vh-4rem)] bg-slate-900">
                                <GameWrapper
                                    config={{ ...gameConfig, scene: VerbalReasoningScene }}
                                    domainCode="VER_REAS"
                                />
                            </div>
                        } />
                        <Route path="/assessment/game/abstract" element={
                            <div className="h-[calc(100vh-4rem)] bg-slate-900">
                                <GameWrapper
                                    config={{ ...gameConfig, scene: AbstractReasoningScene }}
                                    domainCode="ABS_REAS"
                                />
                            </div>
                        } />
                        <Route path="/assessment/game/mechanical" element={
                            <div className="h-[calc(100vh-4rem)] bg-slate-900">
                                <GameWrapper
                                    config={{ ...gameConfig, scene: MechanicalReasoningScene }}
                                    domainCode="MEC_REAS"
                                />
                            </div>
                        } />
                        <Route path="/assessment/game/spatial" element={
                            <div className="h-[calc(100vh-4rem)] bg-slate-900">
                                <GameWrapper
                                    config={{ ...gameConfig, scene: SpatialAbilityScene }}
                                    domainCode="SPA_ABIL"
                                />
                            </div>
                        } />
                        <Route path="/assessment/game/creative" element={
                            <div className="h-[calc(100vh-4rem)] bg-slate-900">
                                <GameWrapper
                                    config={{ ...gameConfig, scene: CreativeThinkingScene }}
                                    domainCode="CRE_THINK"
                                />
                            </div>
                        } />
                        <Route path="/assessment/sit" element={<SituationalJudgementAssessment />} />
                        <Route path="/assessment/interest" element={<InterestInventoryAssessment />} />
                        <Route path="/selection" element={<SchoolSelectionWizard />} />
                    </Route>

                    {/* Protected Parent Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>
                        <Route path="/parent" element={<ParentDashboard />} />
                    </Route>

                    {/* Protected Teacher Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
                        <Route path="/teacher" element={<TeacherDashboard />} />
                    </Route>
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
