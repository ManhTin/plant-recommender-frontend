import { useState, useEffect } from 'react'
import './App.css';
import PocketBase from 'pocketbase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stack, Paper, Table, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, Card, CardContent, CardMedia, Tabs, Tab, Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Divider, LinearProgress, IconButton, Box, TextField, Button, TableBody } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'
import plants from '../plants_names.json'
import { height } from '@mui/system';

export default function Recommendations(props) {
    const navigate = useNavigate()
    const [duration, setDuration] = useState(0)
    const [description, setDescription] = useState('')
    const { state } = useLocation()

    const testplant = [
        {
        name: "Moth Orchid",
        official_name: "Phalaenopsis spp.",
        origins: "Southeast Asia",
        climate: "Tropical & Subtropical",
        description: "An absolute classic, yet so often misunderstood. Once you get to know their unique needs and can read their handy cues, enjoying these beauties will be a breeze. The foliage is pleasantly unassuming and the tangle of aerial roots are curious, but the star of the show is the cluster of blooms that sits atop a long arching stem. True to their name, each bloom looks almost like a moth captured in mid-flight.",
        image: "https://uploads-ssl.webflow.com/5f555a41822a92ae93ebb80d/61f0a214a2cb9abf31a7576a_moth%20orchid-export.png",
        height: 0.1282051282051282,
        width: 0.06872217689411832,
        leaf_shape: "Bright green oblong leaves featuring showy blooms.",
        format: "Aerial roots, thick green leaves, and clusters of bright blooms.",
        difficulty: 0.75,
        water: 0.5,
        light: 1.0,
        alias: "Moth Orchid, Phals"
        },
        {
        name: "Nerve Plant",
        official_name: "Fittonia albivenis",
        origins: "South America",
        climate: "Tropical",
        description: "This little plant packs a punch. Their bright green leaves are strongly contrasted by veins in brilliant white, pink, or red that creates the look of an intricate mosaic with contrasting grout or a depiction of the nervous system.",
        image: "https://uploads-ssl.webflow.com/5f555a41822a92ae93ebb80d/61f0a23294ace3f195702a61_nerve%20plant-export.png",
        height: 0.0,
        width: 0.1203246446515223,
        leaf_shape: "Deep green with high contrast veins and an almond shape.",
        format: "Low bushy clusters of densely packed stems.",
        difficulty: 0.5,
        water: 1.0,
        light: 1.0,
        alias: "Mosaic Plant, Fittonia, Painted Net Leaf"
        }
    ]


    useEffect(() => {
        async function getRecommendations(profile) {
            try {
                const response = await fetch('test.com', {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                })
                const contentType = response.headers.get('content-type')
                if(response.status >= 200 && response.status < 300 && (contentType && contentType.indexOf('application/json') !== -1)){
                    let result = await response.json()
                    return result
                } else {
                    return null;
                }
            } catch (error) {
                console.log(error)
                return null
            }
        }

        console.log("state: ", state)
      }, [])

    const RecomCard = props => {
        const [info, setInfo] = useState(false)

        const handleClickOpen = () => {
            setInfo(true);
        };

        const handleClose = () => {
            setInfo(false)
        }



        const PlantInfo = props => {
            const {info, plant} = props
            const wateringLvls = [ { label: 'Weekly', value: 0 }, { label: 'Biweekly', value: 0.5 }, { label: 'Monthly', value: 1 }]
            const brightnessLvls = [ { label: 'very bright', value: 1 }, { label: 'medium', value: 0.5 }, { label: 'not so bright', value: 0 }]

            const stringifyWater = val => {
                switch (val) {
                    case 0:
                        return "Weekly"
                    case 0.5:
                        return "Biweekly"
                    case 1:
                        return "Monthly"                
                    default:
                        break;
                }
            }

            const stringifyBrightness = val => {
                switch (val) {
                    case 1:
                        return "Very bright"
                    case 0.5:
                        return "medium"
                    case 0:
                        return "not so bright"                
                    default:
                        break;
                }
            }

            const stringifyDifficulty = val => {
                switch (val) {
                    case 0:
                        return "Beginner"
                    case 0.25:
                        return "Intermediate"
                    case 0.5:
                        return "Proficient"
                    case 0.75:
                        return "Advanced"
                    case 1:
                        return "Expert"                
                    default:
                        break;
                }
            }

            return (
                <Dialog open={info} onClose={handleClose}>
                    <DialogTitle>{plant.name}</DialogTitle>
                    <TableContainer component={Paper}>
                    <TableBody>
                        <TableRow>
                            <TableCell>Aliases</TableCell>
                            <TableCell>{plant.alias}</TableCell>
                        </TableRow>                        
                        <TableRow>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>{stringifyDifficulty(plant.difficulty)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Watering</TableCell>
                            <TableCell>{stringifyWater(plant.water)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Light</TableCell>
                            <TableCell>{stringifyBrightness(plant.light)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Format</TableCell>
                            <TableCell>{plant.format}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Leaf-Shape</TableCell>
                            <TableCell>{plant.leaf_shape}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Height (max.)</TableCell>
                            <TableCell>{Math.round(plant.height*100)} cm</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Width (max.)</TableCell>
                            <TableCell>{Math.round(plant.width*100)} cm</TableCell>
                        </TableRow>
                    </TableBody>
                    </TableContainer>
                </Dialog>
            )
        }

        return (
            <Grid xs={4}>
            <Card sx={{ minWidth: 275 }} onClick={handleClickOpen}>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                <CardMedia
                    component="img"
                    sx={{width: 200, alignSelf: "center"}}
                    image={props.plant.image}
                    alt={props.plant.name}
                />
                </Box>

                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {props.plant.official_name}
                    </Typography>
                    <Typography variant="h5" component="div">
                    {props.plant.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Origin: {props.plant.origins} | Climate: {props.plant.climate}
                    </Typography>
                    <Typography variant="body2">
                    {props.plant.description}
                    </Typography>
                </CardContent>
            </Card>
            <PlantInfo info={info} plant={props.plant} onClose={handleClose}/>
            </Grid>
        )
    }
  
    return(
    <Container component="main" sx={{width: '100%', bgcolor: 'background.paper'}}>
    <Box sx={{textAlign: "center", mt: 2}}>
          <Typography component="h4" variant="h4">
              Home Plant Recommender
          </Typography>
          <Typography variant='body1'>
              {state.name}, we recommend you the following plants:
          </Typography>
    </Box>
    <Stack>    
    <Grid container spacing={2} sx={{display: "flex", justifyContent: "center", mt: 3}}>        
        <RecomCard plant={testplant[0]}/>
        <RecomCard plant={testplant[1]}/>
    </Grid>
    <Button variant="outlined" sx={{mt: 2}} onClick={(e) => navigate('/setupProfile')}>Start Over</Button>
    </Stack>
    </Container>

      
    )


}