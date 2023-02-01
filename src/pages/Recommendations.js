import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Stack, Paper, TableCell, TableContainer, TableRow, Dialog, DialogTitle, Card, CardContent, CardMedia, Container, Typography, Box, Button, TableBody } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'
import { apicallGet, apicallPost } from '../callApi';

export default function Recommendations(props) {
    const navigate = useNavigate()
    const [recoms, setRecoms] = useState([])
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
        async function getRec() {
            const recs = await getRecommendations(state)
            const p1 = await getPlantInfo(recs[0])
            const p2 = await getPlantInfo(recs[1])
            const p3 = await getPlantInfo(recs[2])
            setRecoms([p1, p2, p3])            
        }
        getRec()
      }, [])

    async function getPlantInfo(plantId) {
        console.log("getting info for: ", plantId)
        const url = '/api/plants/'+plantId
        const res = await apicallGet('GET', url)
        return res
    }   

    async function getRecommendations(profile) {
        const body = rewriteProfile(profile)
        const url = '/api/recommendations_for_profile'
        const recs = await apicallPost(url, body)
        return recs
    }

    const rewriteProfile = profile => {
        return {
            profile: {
                water: profile.water,
                light: profile.light,
                humidity: profile.humidity ? 0.5 : 0,
                toxicity: profile.pets ? 0 : 0.5,
                difficulty: profile.difficulty,
            },
            liked_plants: profile.liked_plants,
            owned_plants: profile.plants.map(e => {return e.id})
        }
    } 

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

            const stringifyWater = val => {
                switch (parseFloat(val)) {
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
                switch (parseFloat(val)) {
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
                switch (parseFloat(val)) {
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
            <Grid xs={12} sm={4} md={4}>
            <Card sx={{}} onClick={handleClickOpen}>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                <CardMedia
                    component="img"
                    sx={{maxWidth: 200, alignSelf: "center"}}
                    image={props.plant.image_url}
                    alt={props.plant.name}
                />
                </Box>

                <CardContent>
                    <Typography color="text.secondary" gutterBottom>
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
        {recoms.map(p => {
            if(p !== null && p !== undefined){
                console.log("the plant is: ", p)
                return <RecomCard plant={p}/>
            }
            return <></>            
          })}
    </Grid>
    <Button variant="outlined" sx={{mt: 2}} onClick={(e) => navigate('/setupProfile')}>Start Over</Button>
    </Stack>
    </Container>

      
    )


}