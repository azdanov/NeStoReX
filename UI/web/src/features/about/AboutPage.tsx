import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

import { api } from "../../app/api/api.ts";

export function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  return (
    <Container>
      <Typography gutterBottom variant="h2">
        Errors for testing purposes
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          onClick={() =>
            api.errors
              .get400Error()
              .catch((error) => toast.error(error.json.title))
          }
          variant="contained"
        >
          Test 400 error
        </Button>
        <Button
          onClick={() =>
            api.errors
              .get401Error()
              .catch((error) => toast.error(error.json.title))
          }
          variant="contained"
        >
          Test 401 error
        </Button>
        <Button
          onClick={() =>
            api.errors
              .get404Error()
              .catch((error) => toast.error(error.json.title))
          }
          variant="contained"
        >
          Test 404 error
        </Button>
        <Button
          onClick={() =>
            api.errors
              .get500Error()
              .catch((error) => toast.error(error.json.title))
          }
          variant="contained"
        >
          Test 500 error
        </Button>
        <Button
          onClick={() =>
            api.errors
              .getValidationError()
              .then(() => console.log("should not see this!"))
              .catch((error) => {
                toast.error(error.json.title);
                setValidationErrors(Object.values(error.json.errors));
              })
          }
          variant="contained"
        >
          Test validation error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((error) => (
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}
