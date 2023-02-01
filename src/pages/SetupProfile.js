import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Chip, Container, Typography, Box, TextField, Button, Rating, Stack, Autocomplete, Switch } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useTheme, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import StarIcon from '@mui/icons-material/Star';
import plants from '../plants_names.json'
import { apicallGet } from '../callApi';

export default function SetupProfile() {
    const navigate = useNavigate()
    const [question, setQuestion] = useState(0)
    const [profile, setProfile] = useState({liked_plants: []})
    const [quizState, setQuizState] = useState(0)
    const [comparison_test, setComparison_test] = useState([])
    const test = [
      {left: 1, right: 2},
      {left: 3, right: 4},
      {left: 5, right: 6},
      {left: 7, right: 8},
      {left: 9, right: 10}
    ]



    const theme = useTheme();

    useEffect(() => {
      async function getComp() {
          const url = '/api/plant_pairs'
          const recs = await apicallGet('GET', url)          
          setComparison_test(recs)            
      }
      getComp()
    }, [])



    const AvatarImage = (props) => {
        return (
            <Box
            component="img"
            sx={{ width: 300 }}
            alt="plant_image"
            src={props.side === "left" ? plants.find(e => e.id === comparison_test[question].left).image_url : plants.find(e => e.id === comparison_test[question].right).image_url}
            />
        )
    }
    

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#1A2027',
        ...theme.typography.body1,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    const handleClick = (choice, questionNo) => {
        console.log('hello', questionNo)
        //let quest = question_test.find(e => e.no === questionNo)
        let quest = comparison_test[questionNo]
        console.log(quest)
        //setProfile({
        //    ...profile,
        //    [quest.result.attr]: choice === 'left' ? quest.result.left : quest.result.right 
        //})
        setProfile({
          ...profile,
          liked_plants: [
            ...profile.liked_plants,
            choice === "left" ? comparison_test[questionNo].left : comparison_test[questionNo].right,
          ]
        })
        if (1+questionNo >= comparison_test.length) {
          setQuizState(1+quizState)
        } else {
          setQuestion(1+questionNo)  
        }        
    }

    const Question = props => {
        return (
            <>
            <Grid container spacing={2}>
                <Grid xs={6}>
                    <Item onClick={(e) => {handleClick('left', question)}}>
                    <AvatarImage side="left"/>
                    </Item>
                </Grid>
                <Grid xs={6}>
                    <Item onClick={(e) => {handleClick('right', question)}}>
                    <AvatarImage side="right"/>
                    </Item>
                </Grid>
            </Grid>                     
            <Typography component="h4" variant="h4" sx={{mt: 2}}>
              Please click on the plant you like better
            </Typography>
            </>
        )
    }

    const labels = {
        1: 'Beginner',
        2: 'Intermediate',
        3: 'Proficient',
        4: 'Advanced',
        5: 'Expert',
      };
      
      function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
      }

    const handleQuizz = (info) => {
      console.log(info)
      let curr_prof = profile
      let new_prof = {
        ...curr_prof,
        ...info
      }
      setProfile(new_prof)
      setQuizState(1+quizState)
    }  





    // get Name, Experience 1-5, Watering (weekly, biweekly, monthly 0, 0,5, 1), pets (y0 /n0,5), brightness (very bright 1, medium 0,5, low brightness 0) spray yes 0,5 / no 0
    const Quiz = props => {
        const wateringLvls = [ { label: 'Weekly', value: 0 }, { label: 'Biweekly', value: 0.5 }, { label: 'Monthly', value: 1 }]
        const brightnessLvls = [ { label: 'very bright', value: 1 }, { label: 'medium', value: 0.5 }, { label: 'not so bright', value: 0 }]
        const [name, setName] = useState("")
        const [watering, setWatering] = useState(wateringLvls[0])
        const [brightness, setBrightness] = useState(brightnessLvls[0])
        const [spray, setSpray] = useState(true)
        const [pets, setPets] = useState(false)
        const [value, setValue] = useState(2);
        const [hover, setHover] = useState(-1);

        const adjustDifficulty = val => {
          switch (val) {
            case 1:
                return 0
            case 2:
                return 0.25
            case 3:
                return 0.5
            case 4:
                return 0.75
            case 5:
                return 1                
            default:
                break;
        }
        }

        const handleQuizSubmit = () => {
            if(name.length === 0) {
              alert("Please give us your name!")
            } else{
              let values = {
                name: name,
                water: watering.value,
                light: brightness.value,
                humidity: spray,
                pets: pets,
                difficulty: adjustDifficulty(value)
              }
              props.handleQuizz(values)
            }
        }


        return (
            <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleQuizSubmit}
          >

            <Stack spacing={2}>
            <Paper sx={{textAlign: "center"}}><TextField name="name" id="standard-basic" label="Please tell us your name" required="true" variant="standard" sx={{ml: 2, mt: 1, mb: 1}} value={name} onChange={(e) => setName(e.target.value)} /></Paper>
            <Paper>
            <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 1,
              mb: 1
            }}
          >
            How experienced are you?
            <Rating
              sx={{ml: 3}} 
              name="hover-feedback"
              value={value}
              precision={1}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {value !== null && (
              <Box sx={{ ml: 2, width: 90 }}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
          </Container>
            </Paper>
            <Paper>
                <Autocomplete
                disablePortal
                id="combo-box-demo"
                name="watering"
                options={wateringLvls}
                renderInput={(params) => <TextField {...params} label="How often do you want to water your plant?" />}
                value={watering}
                onChange={(event, newValue) => {setWatering(newValue)}}
                />
            </Paper>
            <Paper>
                <Autocomplete
                disablePortal
                id="combo-box-demo2"
                name="brightness"
                options={brightnessLvls}
                renderInput={(params) => <TextField {...params} label="How bright is the spot you plan for your plant?" />}
                value={brightness}
                onChange={(event, newValue) => {setBrightness(newValue)}}
                />
            </Paper>
            <Paper>
              <Stack direction="row" spacing={1} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                Do you have pets? 
                <Switch name="pets" inputProps={{ 'aria-label': 'pets' }} value={pets} onChange={(e) => setPets(e.target.value)}/>
              </Stack>
                {/*Do you have pets? <Switch sx={{mt: 1, mb: 1}} name="pets" inputProps={{ 'aria-label': 'pets' }} value={pets} onChange={(e) => setPets(e.target.value)}/>*/}
            </Paper>
            <Paper >
              <Stack direction="row" spacing={1} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                Would you spray you plants with water?
                <Switch name="spray" inputProps={{ 'aria-label': 'water' }} defaultChecked value={spray} onChange={(e) => setSpray(e.target.value)}/>
              </Stack>
            </Paper>
            </Stack>
            <Button variant="outlined" color="secondary" type="submit" sx={{mt: 2}}>Save</Button>
            </Box>
            
        )
    }

    const ChooseExisting = props => {
      const [choosenPlants, setChoosenPlants] = useState([])

      const addNewPlant = plant => {
        console.log("oning plant: ", plant)
        setChoosenPlants([
          ...choosenPlants,
          plant
        ])
      }

      const save = () => {
        handleQuizz({plants: choosenPlants})
      }

      return(
      <Stack spacing={1} sx={{maxWidth: 350}}>
        <Typography variant='body2'>
          Please tell us what plants you already have
        </Typography>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={plants}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Plant" />}
          onChange={(event, newValue) => {addNewPlant(newValue)}}
          sx={{mb: 2}}
          disableClearable      
        />
        {/*<Stack direction="row" spacing={1} sx={{display: "flex", justifyContent: "center"}}>*/}
        <Grid container spacing={1}>
          {choosenPlants.map(plant => {
            return <Grid xs={4}><Chip label={plant.name} variant="outlined" sx={{mr:1}} onClick={(e) => {setChoosenPlants(choosenPlants.filter(e => plant.id !== e.id))}}/></Grid>
          })}
        </Grid>
        {/*</Stack>*/}
        <Button variant="outlined" color="secondary" type="submit" sx={{mt: 2}} onClick={save}>Save</Button>
      </Stack>
      )
    }

    const renderComponent = () => {
      switch (quizState) {
        case 0:
          return <Quiz handleQuizz={handleQuizz}/>
        case 1:
          return <ChooseExisting/>
        case 2:
          return <Question/>
        case 3:
          navigate('/recommend', {replace: true, state: profile})
          break        
        default:
          return <></>
      }
    }


    return(
      <Container component="main" sx={{width: '100%', bgcolor: 'background.paper'}}>
      <Box sx={{textAlign: "center", mt: 2}}>
          <Typography component="h4" variant="h4">
              Home Plant Recommender
          </Typography>
          <Typography variant='body1'>
              Please give us some info about yourself.
          </Typography>
      </Box>
      <Container sx={{ 
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
        }}>
      <Box sx={{textAlign: "center", mt: 2}}>
        {/*<Quiz handleQuizz={handleQuizz}/>*/}
        {renderComponent()}
      </Box>
      <Box sx={{textAlign: "center", mt: 2}}>

      </Box>
        
      </Container>
    </Container>

      
    )


}