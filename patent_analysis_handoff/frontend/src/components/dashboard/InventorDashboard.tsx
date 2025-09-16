
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const InventorDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', 'inventor'],
    queryFn: dashboardAPI.getInventorDashboard,
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  const quickActions = [
    {
      title: 'Patent Search',
      description: 'Search existing patents',
      icon: <SearchIcon />,
      action: () => navigate('/search'),
      color: 'primary',
    },
    {
      title: 'Check Patentability',
      description: 'Assess your invention',
      icon: <ScienceIcon />,
      action: () => navigate('/search?type=patentability'),
      color: 'secondary',
    },
    {
      title: 'Prior Art Analysis',
      description: 'Find similar inventions',
      icon: <AssessmentIcon />,
      action: () => navigate('/search?type=prior-art'),
      color: 'success',
    },
  ];

  const recentAnalyses = dashboardData?.recentAnalyses || [];
  const patentabilityScores = dashboardData?.patentabilityScores || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventor Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Here's what's happening with your patent research.
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 2 },
                        height: '100%',
                      }}
                      onClick={action.action}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Box sx={{ color: `${action.color}.main`, mb: 1 }}>
                          {action.icon}
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Stats
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Searches This Month
                </Typography>
                <Typography variant="h4" color="primary">
                  {dashboardData?.monthlySearches || 0}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Analyses Completed
                </Typography>
                <Typography variant="h4" color="secondary">
                  {dashboardData?.completedAnalyses || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Average Patentability Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" color="success.main">
                    {dashboardData?.avgPatentabilityScore || 0}%
                  </Typography>
                  <TrendingUpIcon color="success" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Patentability Scores */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Patentability Assessments
              </Typography>
              {patentabilityScores.length > 0 ? (
                <List>
                  {patentabilityScores.slice(0, 5).map((score: any, index: number) => (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        <LightbulbIcon color={score.score > 70 ? 'success' : score.score > 40 ? 'warning' : 'error'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={score.title || `Analysis ${index + 1}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Score: {score.score}% • {new Date(score.date).toLocaleDateString()}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={score.score}
                              sx={{ mt: 1, height: 6, borderRadius: 3 }}
                              color={score.score > 70 ? 'success' : score.score > 40 ? 'warning' : 'error'}
                            />
                          </Box>
                        }
                      />
                      <IconButton size="small" onClick={() => navigate(`/analysis/${score.id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No patentability assessments yet. Start by searching for patents!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Analyses */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Analyses
              </Typography>
              {recentAnalyses.length > 0 ? (
                <List>
                  {recentAnalyses.slice(0, 5).map((analysis: any, index: number) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={analysis.patentTitle || analysis.patentNumber || `Analysis ${index + 1}`}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Chip
                              label={analysis.status}
                              size="small"
                              color={
                                analysis.status === 'completed' ? 'success' :
                                analysis.status === 'processing' ? 'warning' : 'default'
                              }
                            />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(analysis.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <IconButton size="small" onClick={() => navigate(`/analysis/${analysis.id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No analyses yet. Start by creating your first project!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tips for Inventors */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Tips for Inventors
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Document Everything
                  </Typography>
                  <Typography variant="body2">
                    Keep detailed records of your invention process, including dates, sketches, and iterations.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Search Early and Often
                  </Typography>
                  <Typography variant="body2">
                    Regular patent searches can help you avoid infringement and identify opportunities.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Consider Timing
                  </Typography>
                  <Typography variant="body2">
                    File your patent application within one year of any public disclosure of your invention.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
