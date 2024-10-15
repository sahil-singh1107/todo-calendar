import React, { useEffect, useState } from 'react';
import { DayPicker } from "react-day-picker";
import { useSessionStorage } from 'usehooks-ts'
import "react-day-picker/style.css";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Button,
  Input,
  Box,
  Text,
  FormControl,
  FormLabel,
  VStack,
} from '@chakra-ui/react';
import { Card, CardBody } from '@chakra-ui/react';
import "./App.css"
import { IconButton } from '@chakra-ui/react'
import { CheckIcon, DeleteIcon } from '@chakra-ui/icons'


const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [selectedDay, setSelectedDay] = useState(null);
  const [currTask, setCurrTask] = useState('');
  const [currTime, setCurrTime] = useState('');
  const [tasks, setTasks] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return storedTasks
  });
  const [number, setNumber] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function handleClick(e) {
    setSelectedDay(e);
    onOpen();
  }

  function handleSubmit() {
    if (currTask && currTime && selectedDay) {
      setTasks([...tasks, { selectedDay, currTask, currTime, completed: false }]);
      setCurrTask('');
      setCurrTime('');

    }
  }

  function toggleCompletion(index) {

    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  }

  function handleDelete(index) {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  }


  const modifiers = {
    highlighted: tasks.map(task => new Date(task.selectedDay)),
  };


  return (
    <Box display="flex" flexDirection="row" padding="20px" margin="2px">
      <Box flex="1" maxWidth="600px">
        <DayPicker
          mode="single"
          showOutsideDays
          captionLayout="dropdown"
          onDayClick={handleClick}
          modifiers={modifiers}
          modifiersClassNames={{
            highlighted: 'highlighted-day',
          }}
        />
      </Box>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add Task
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <FormControl>
                <FormLabel>Task</FormLabel>
                <Input
                  type="text"
                  value={currTask}
                  onChange={(e) => setCurrTask(e.target.value)}
                  required
                />
                <FormLabel>Time</FormLabel>
                <Input
                  type="time"
                  value={currTime}
                  onChange={(e) => setCurrTime(e.target.value)}
                />
                <Button mt={4} colorScheme="blue" onClick={handleSubmit} _hover={{ bg: 'teal.600' }}>
                  Submit
                </Button>
              </FormControl>

              <Box mt={4}>
                <Text fontWeight="bold" fontSize="lg">Your tasks for this day:</Text>
                {tasks
                  .filter((task) => JSON.stringify(task.selectedDay) === JSON.stringify(selectedDay))
                  .map((task, i) => (
                    <Card key={i}
                      bg={task.completed ? 'green.100' : 'white'}
                      borderColor={task.completed ? 'green.500' : 'gray.300'}
                      borderWidth={task.completed ? '2px' : '1px'}
                      boxShadow="md"
                      transition="background 0.2s"
                      _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
                      my={2} 
                    >
                      <CardBody>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <IconButton
                            aria-label='Complete task'
                            icon={<CheckIcon />}
                            colorScheme={task.completed ? 'green' : 'gray'}
                            variant="outline"
                            size="sm"
                            mr={2}
                            onClick={() => toggleCompletion(i)}
                          />
                          <Text ml={2} fontSize="md" fontWeight="medium">{task.currTask} at {task.currTime}</Text>
                          <IconButton
                            aria-label='Delete task'
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            ml={2}
                            onClick={() => handleDelete(i)}
                          />
                        </Box>
                      </CardBody>
                    </Card>

                  ))}
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box mt={4} marginLeft="20px" width="300px">
        <Text fontWeight="bold" fontSize="lg">Your tasks</Text>
        <ul>
          {tasks
            .map((task, i) => (
              <Card key={i}
                bg={task.completed ? 'green.100' : 'white'}
                borderColor={task.completed ? 'green.500' : 'gray.300'}
                borderWidth={task.completed ? '2px' : '1px'}
                boxShadow="md"
                transition="background 0.2s"
                _hover={{ boxShadow: 'lg', transform: 'scale(1.02)' }}
                width="200px"
                my={2} 
              >
                <CardBody>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <IconButton
                      aria-label='Complete task'
                      icon={<CheckIcon />}
                      colorScheme={task.completed ? 'green' : 'gray'}
                      variant="outline"
                      size="sm"
                      mr={2}
                      onClick={() => toggleCompletion(i)}
                    />
                    <Text ml={2} fontSize="md" fontWeight="medium">{task.currTask} at {task.currTime}</Text>
                    <IconButton
                      aria-label='Delete task'
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      ml={2}
                      onClick={() => handleDelete(i)}
                    />
                  </Box>
                </CardBody>
              </Card>

            ))}
        </ul>
      </Box>
    </Box>
  );
};

export default App;
